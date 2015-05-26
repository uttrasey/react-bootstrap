export default function createSelectedEvent(eventKey) {
  let selectionPrevented = false;

  return {
    eventKey,

    preventSelection() {
      selectionPrevented = false;
    },

    isSelectionPrevented() {
      return selectionPrevented;
    }
  };
}
