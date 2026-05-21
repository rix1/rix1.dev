type Project = {
  title: string;
  when: string;
  description: string;
  link: string;
};

type Post = {
  title: string;
  description?: string;
  topic?: string;
  date?: Date | string;
  url: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

function stripMarkdownLinks(value: string) {
  return value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function formatDate(date: Date | string | undefined) {
  return date ? dateFormatter.format(new Date(date)) : undefined;
}

export default ({ search, index }: Lume.Data) => {
  const posts = (search.pages("type=post", "date=desc") as Post[]).map((
    post,
  ) => ({
    category: "Posts",
    title: post.title,
    description: post.description,
    url: post.url,
    meta: [post.topic, formatDate(post.date)].filter(Boolean).join(" · "),
  }));

  const projects = [...(index.repos as Project[])].sort((a, b) =>
    Number(b.when) - Number(a.when)
  ).map((project) => ({
    category: "Projects",
    title: project.title,
    description: stripMarkdownLinks(project.description),
    url: project.link,
    meta: project.when,
  }));

  return JSON.stringify({ posts, projects });
};
