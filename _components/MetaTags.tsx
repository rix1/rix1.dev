type Props = {
  canonicalUrl: string;
};

const MetaTags = ({ canonicalUrl }: Props) => {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:image:height" content="600" />
      <meta property="og:image:width" content="1200" />
      <meta
        property="og:image:alt"
        content="On the internet, I'm usually referred to as @rix1. I'm a product developer at Otovo, living in Oslo, Norway."
      />
      <link rel="stylesheet" href="/globals.css" />
      <script type="module" src="/assets/command-palette.js"></script>
    </>
  );
};

export default MetaTags;
