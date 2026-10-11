import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import { QuestionReviewList } from "./QuizReviewList";

const dummyQuestions = [
  {
    id: 1,
    questionNumber: "Nomor 1",
    questionText:
      "If she _______ earlier, she wouldn't have missed the flight to Tokyo.",
    userAnswer: "A. had awoken.",
    status: "correct" as const,
  },
  {
    id: 2,
    questionNumber: "Nomor 2",
    questionText:
      "If she _______ earlier, she wouldn't have missed the flight to Tokyo.",
    userAnswer: "A. come",
    status: "wrong" as const,
  },
  {
    id: 3,
    questionNumber: "Nomor 3",
    questionText:
      "If she _______ earlier, she wouldn't have missed the flight to Tokyo.",
    userAnswer: "A. had awoken.",
    status: "correct" as const,
  },
  {
    id: 4,
    questionNumber: "Nomor 4",
    questionText:
      "If she _______ earlier, she wouldn't have missed the flight to Tokyo.",
    userAnswer: "Akdjddf jdiefijsdnd",
    status: "wrong" as const,
  },
  {
    id: 5,
    questionNumber: "Nomor 5",
    questionText:
      "If she _______ earlier, she wouldn't have missed the flight to Tokyo.",
    userAnswer: "Akdjddf jdiefijsdnd",
    status: "wrong" as const,
  },
  {
    id: 6,
    questionNumber: "Nomor 6",
    questionText:
      "If she _______ earlier, she wouldn't have missed the flight to Tokyo.",
    userAnswer: "Akdjddf jdiefijsdnd",
    status: "wrong" as const,
  },
];

export default function QuizResultDetails() {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header title="Detail Jawaban" />
      </div>
      <XPadding className="py-8">
        <QuestionReviewList questions={dummyQuestions} />
      </XPadding>
    </div>
  );
}
