// SMS/USSD fallback for users with basic phones and no data connection
// (pitch Section 10). Core quiz questions go out by SMS; answers come back
// the same way and are logged through the same responses pipeline as the
// PWA, tagged with content_format_used = "sms".

interface SendQuizSmsParams {
  phoneNumber: string;
  moduleId: number;
  questionText: string;
}

export async function sendQuizSms({ phoneNumber, moduleId, questionText }: SendQuizSmsParams) {
  const apiKey = process.env.AFRICAS_TALKING_API_KEY;
  const username = process.env.AFRICAS_TALKING_USERNAME;

  if (!apiKey || !username) {
    throw new Error("Africa's Talking credentials not configured");
  }

  const response = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      username,
      to: phoneNumber,
      message: `BIPI Module ${moduleId}: ${questionText}\nReply with your answer.`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Africa's Talking request failed: ${response.status}`);
  }

  return response.json();
}
