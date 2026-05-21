type Props = {
  backHref?: string;
  backLabel?: string;
};

const SiteNav = ({ backHref = "/", backLabel = "Back home" }: Props) => {
  return (
    <nav class="not-prose mb-12 flex items-center justify-between gap-4">
      <a href="/" class="clear group inline-flex items-center gap-3">
        <span class="mini-avatar" aria-hidden="true"></span>
        <span>
          <span class="block bricolage-grotesque-heavy text-lg leading-none text-gray-950 group-hover:text-primary">
            rix1
          </span>
          <span class="block text-xs font-semibold text-gray-500">
            Product, code, notes
          </span>
        </span>
      </a>
      <a
        href={backHref}
        class="clear rounded-full border border-primary/10 bg-white/70 px-3 py-1.5 text-sm font-semibold text-primary shadow-sm hover:bg-white"
      >
        {backLabel}
      </a>
    </nav>
  );
};

export default SiteNav;
