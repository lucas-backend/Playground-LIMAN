interface Props {
  text: string;
}

export default function QuestionText({ text }: Props) {
  return <p className="">{text}</p>;
}
