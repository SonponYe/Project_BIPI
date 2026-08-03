"use client";

// Curated real footage (Joy News, Citinewsroom, GhanaWeb) — BIPI curates
// links, it does not produce video (pitch Section 4/16).
export function NewsClipPlayer({
  videoUrl,
  questions,
  onAnswered,
}: {
  videoUrl: string;
  questions: string[];
  onAnswered: (answers: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={videoUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        />
      </div>
      <NewsClipQuestions questions={questions} onAnswered={onAnswered} />
    </div>
  );
}

function NewsClipQuestions({
  questions,
  onAnswered,
}: {
  questions: string[];
  onAnswered: (answers: string[]) => void;
}) {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onAnswered(questions.map((_, i) => String(formData.get(`q${i}`) ?? "")));
      }}
    >
      {questions.map((question, i) => (
        <label key={question} className="flex flex-col gap-1">
          <span>{question}</span>
          <input name={`q${i}`} className="rounded border border-gray-300 px-3 py-2" />
        </label>
      ))}
      <button type="submit" className="rounded-lg bg-pulse-500 px-4 py-2 text-white">
        Submit
      </button>
    </form>
  );
}
