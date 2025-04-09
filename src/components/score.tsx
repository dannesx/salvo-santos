type Props = {
  name: string
  score: number
  side: "left" | "right"
}

const Score = ({ name, score, side }: Props) => {
  return (
    <div
      className={`absolute bottom-4 p-3 data-[side=left]:left-4 data-[side=right]:right-4 bg-secondary rounded text-white flex flex-col items-center w-28 gap-1 ring-4 ring-primary`}
      data-side={side}
    >
      <h3 className="leading-none text-lg">{name}</h3>
      <p className="leading-none text-2xl">{score}</p>
    </div>
  )
}

export default Score
