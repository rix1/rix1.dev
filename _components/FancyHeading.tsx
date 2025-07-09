type Props = {
  children: string;
};

const FancyHeading = ({ children }: Props) => {
  const firstPart = children.__html.split(" ").slice(0, -1);
  const lastWord = children.__html.split(" ").at(-1);

  const transforms = [
    "rotate(5deg) translateY(-2px)",
    "scaleX(-1)",
    "rotate(-8deg) translateY(1px)",
    "rotate(-180deg)",
    "rotate(12deg) scale(0.9) translateY(2px)",
    "scaleX(1.1) translateY(-3px)",
    "scaleX(-1) translateY(1px)",
    "scale(1.2) rotate(8deg) translateY(-2px)",
    "scale(-1) translateY(1px)",
    "scaleY(-1) rotate(-5deg) translateY(3px)",
  ];

  return (
    <h1 class={`text-balance ${lastWord === "designer" ? "fancy" : ""}`}>
      {{ __html: firstPart.join(" ") }}{" "}
      <span>
        {[...lastWord].map((char, index) => (
          <span
            style={{
              "--char-transform": transforms[index % transforms.length],
              "--delay": `${index * 24}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </h1>
  );
};

export default FancyHeading;
