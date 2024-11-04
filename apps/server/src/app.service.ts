import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import path from "path";
import { google } from "googleapis";

@Injectable()
export class AppService {
  private readonly CREDENTIALS_PATH = path.join(
    __dirname,
    "../../../../../",
    "credentials-1.json"
  );
  // private readonly SCOPES = [
  //   "https://www.googleapis.com/auth/meetings.space.created",
  // ];
  private readonly SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return `Hello World! from ${this.configService.get<string>("APP_URL")}`;
  }

  getFormattedDateTime(daysToAdd: number = 0) {
    const date = new Date(); // Current date and time

    date.setDate(date.getDate() + daysToAdd);

    // Format date to 'YYYY-MM-DDTHH:mm:ss'
    const dateTime = date.toISOString().slice(0, 19); // Remove milliseconds and timezone

    // Get timezone offset in hours and minutes
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
    const minutes = String(Math.abs(offset) % 60).padStart(2, "0");

    return `${dateTime}${sign}${hours}:${minutes}`;
  }

  async startSpace() {
    try {
      const CLIENT_ID = this.configService.get<string>(
        "GOOGLE_GMAIL_CLIENT_ID"
      );
      const CLIENT_SECRET = this.configService.get<string>(
        "GOOGLE_GMAIL_CLIENT_SECRET"
      );
      const REFRESH_TOKEN = this.configService.get<string>(
        "GOOGLE_GMAIL_REFRESH_TOKEN"
      );
      const REDIRECT_URI = this.configService.get<string>(
        "GOOGLE_GMAIL_REDIRECT_URI"
      );

      const oAuth2Client: any = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );

      // Create in loop, by getting different refresh_token from google users redis.
      oAuth2Client.setCredentials({
        refresh_token:
          "1//0gQeiJIH3Qoy9CgYIARAAGBASNwF-L9IrDSnrEZeV1pHsV09OB-0TwL0ho-HN27cbChlfWPaztUJmMmWb-0vUhao5RfKkhClIeys",
      });

      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

      const event = {
        summary: "Google I/O 2015",
        location: "800 Howard St., San Francisco, CA 94103",
        description: "A chance to hear more about Google's developer products.",
        start: {
          dateTime: this.getFormattedDateTime(7),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: this.getFormattedDateTime(7), // Use dateTime here instead of date
          timeZone: "Asia/Kolkata",
        },
        recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
        attendees: [
          { email: "kaviarasan.r26@gmail.com", organizer: false, self: false },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 10 },
          ],
        },
        conferenceData: {
          createRequest: {
            requestId: "sample123", // A unique identifier for this request
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      };

      try {
        const response = await calendar.events.insert({
          auth: oAuth2Client,
          calendarId: "primary",
          conferenceDataVersion: 1, // Required to enable Meet link creation
          requestBody: event, // Spread the event properties directly here
        });

        console.log("Event created:", response.data);
        console.log("Google Meet Link:", response.data.hangoutLink);
      } catch (err) {
        console.error("Error creating event:", err);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
