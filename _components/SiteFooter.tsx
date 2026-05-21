export default ({ comp }: Lume.Data) => {
  return (
    <footer class="not-prose mx-auto mt-20 max-w-5xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div class="border-t border-primary/10 pt-8">
        <div class="flex items-start gap-4">
          <p class="m-0 max-w-2xl text-sm leading-6 text-gray-600">
            This is Rix1's personal site for notes on products, technology,
            design, building things, and life.
          </p>
          <comp.ShareIcons showDivider={false} class="w-full self-center" />
        </div>
      </div>
    </footer>
  );
};
