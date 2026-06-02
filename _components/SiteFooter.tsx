export default ({ comp }: Lume.Data) => {
  return (
    <footer class="not-prose mx-auto mt-16 max-w-5xl px-4 pb-12 pt-8 sm:mt-20 sm:px-6 lg:px-8">
      <div class="border-t border-primary/10 pt-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <p class="m-0 max-w-2xl text-sm leading-6 text-gray-600">
            This is Rix1's personal site for notes on products, technology,
            design, building things, and life.
          </p>
          <p class="m-0 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Visitors:{" "}
            <a
              href="/status/"
              data-visitor-counter
              hidden
              class="text-gray-500 underline decoration-primary/30 underline-offset-4 transition hover:text-primary"
            >
            </a>
          </p>
          <comp.ShareIcons showDivider={false} class="w-full" />
        </div>
      </div>
      <script type="module" src="/assets/visitor-counter.js"></script>
    </footer>
  );
};
