function getScrollBottom(target: HTMLElement) {
  const { height: rectHeight } = target.getBoundingClientRect();
  const scrollHeight = target.scrollHeight + (Math.floor(rectHeight) - rectHeight);
  return Math.max(0, scrollHeight - (rectHeight + target.scrollTop));
}

export function bottomScroller(target: HTMLElement | null) {
  if (!target) return () => undefined;

  let scrollBottomSaved = getScrollBottom(target);
  let preventScrollComputation = false;
  let timeoutHandler: NodeJS.Timer;

  function handleScroll() {
    if (!target) return;
    if (!preventScrollComputation) scrollBottomSaved = getScrollBottom(target);
  }

  function handleResize() {
    if (!target) return;
    preventScrollComputation = true;
    const { height: rectHeight } = target.getBoundingClientRect();
    const scrollHeight = target.scrollHeight;
    target.scrollTop = scrollHeight - (rectHeight + scrollBottomSaved) + (scrollBottomSaved <= 1 ? 1 : 0);
    clearTimeout(timeoutHandler);
    timeoutHandler = setTimeout(() => {
      preventScrollComputation = false;
    }, 100);
  }

  target.addEventListener("scroll", handleScroll);

  const ro = new ResizeObserver((entries) => entries.forEach(handleResize));
  ro.observe(target);

  return () => {
    target.removeEventListener("scroll", handleScroll);
    ro.unobserve(target);
  };
}
