function getScrollBottom(target: HTMLElement) {
  const { height: containerHeight } = target.getBoundingClientRect();
  const scrollHeight = target.scrollHeight + (Math.floor(containerHeight) - containerHeight);
  return Math.max(0, scrollHeight - (containerHeight + target.scrollTop));
}

export function bottomScroller(target: HTMLElement) {
  let preventScrollHandling = false;
  let scrollBottomSaved = getScrollBottom(target);

  function handleWheel() {
    scrollBottomSaved = getScrollBottom(target);
  }

  function handleScroll() {
    if (target.scrollTop <= 1) target.scrollTop = 1;
    if (preventScrollHandling) {
      preventScrollHandling = false;
    } else {
      scrollBottomSaved = getScrollBottom(target);
    }
  }

  function handleResize() {
    preventScrollHandling = true;
    const { height: containerHeight } = target.getBoundingClientRect();
    const scrollHeight = target.scrollHeight + (Math.floor(containerHeight) - containerHeight);
    target.scrollTop = scrollHeight - (containerHeight + scrollBottomSaved) + (scrollBottomSaved <= 1 ? 1 : 0); // This will trigger a scroll event
  }

  const ro = new ResizeObserver((entries) => entries.forEach(handleResize));
  ro.observe(target);

  target.addEventListener("scroll", handleScroll);
  target.addEventListener("wheel", handleWheel);

  return () => {
    ro.unobserve(target);

    target.removeEventListener("scroll", handleScroll);
    target.removeEventListener("wheel", handleWheel);
  };
}

export function autoScrollWhenScrollable(target: HTMLElement) {
  const targetChild = target.children[0] as HTMLElement;

  let parentHeight = target.offsetHeight;
  let childHeight = targetChild.offsetHeight;
  let scrollable = childHeight > parentHeight;

  function handleResize() {
    parentHeight = target.offsetHeight;
    childHeight = targetChild.offsetHeight;
    const nextScrollable = childHeight > parentHeight;
    if (nextScrollable && !scrollable) {
      target.scrollTop = 999999;
    }
    scrollable = nextScrollable;
  }

  const ro = new ResizeObserver((entries) => entries.forEach(handleResize));
  ro.observe(targetChild);

  return () => {
    ro.unobserve(targetChild);
  };
}
