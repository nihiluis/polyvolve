
import findTabbable from './tabbable'

const focusLaterElements: Element[] = []
let modalElement
let needToFocus = false

export function handleBlur() {
  needToFocus = true
}

export function handleFocus() {
  if (needToFocus) {
    needToFocus = false
    if (!modalElement) {
      return
    }
    // need to see how jQuery shims document.on('focusin') so we don't need the
    // setTimeout, firefox doesn't support focusin, if it did, we could focus
    // the element outside of a setTimeout. Side-effect of this implementation
    // is that the document.body gets focus, and then we focus our element right
    // after, seems fine.
    setTimeout(() => {
      if (modalElement.contains(document.activeElement)) {
        return
      }
      const el = (findTabbable(modalElement)[0] || modalElement)
      el.focus()
    }, 0)
  }
}

export function markForFocusLater() {
  focusLaterElements.push(document.activeElement)
}

/* eslint-disable no-console */
export function returnFocus() {
  let toFocus: HTMLElement | undefined
  try {
    toFocus = focusLaterElements.pop() as HTMLElement
    if (toFocus) toFocus.focus()
    return
  } catch (e) {
    console.warn([
      'You tried to return focus to',
      toFocus,
      'but it is not in the DOM anymore'
    ].join(" "))
  }
}
/* eslint-enable no-console */

export function setupScopedFocus(element) {
  modalElement = element

  if (window.addEventListener) {
    window.addEventListener('blur', handleBlur, false)
    document.addEventListener('focus', handleFocus, true)
  } else {
    (window as any).attachEvent('onBlur', handleBlur)
    (document as any).attachEvent('onFocus', handleFocus)
  }
}

export function teardownScopedFocus() {
  modalElement = null

  if (window.addEventListener) {
    window.removeEventListener('blur', handleBlur)
    document.removeEventListener('focus', handleFocus)
  } else {
    (window as any).detachEvent('onBlur', handleBlur)
    (document as any).detachEvent('onFocus', handleFocus)
  }
}
