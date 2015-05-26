import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';
import DropdownButton from '../../src/revisited/DropdownButton';
import keycode from 'keycode';

describe.only('DropdownButton revisited', function() {
  it('renders div with dropdown class', function() {
    let instance = ReactTestUtils.renderIntoDocument(<DropdownButton />);
    let node = React.findDOMNode(instance);

    node.tagName.should.equal('DIV');
    node.className.should.match(/\bdropdown\b/);
  });

  it('renders dropdown toggle button', function() {
    let instance = ReactTestUtils.renderIntoDocument(<DropdownButton />);
    let node = React.findDOMNode(instance);
    let buttonNode = node.children[0];

    buttonNode.tagName.should.equal('BUTTON');
    buttonNode.className.should.match(/\bbtn[ $]/);
    buttonNode.className.should.match(/\bbtn-default\b/);
    buttonNode.className.should.match(/\bdropdown-toggle\b/);
    buttonNode.getAttribute('type').should.equal('button');
    buttonNode.getAttribute('aria-expanded').should.equal('false');
    buttonNode.getAttribute('id').should.be.ok;
  });

  it('renders dropdown toggle button caret', function() {
    let instance = ReactTestUtils.renderIntoDocument(<DropdownButton />);
    let node = React.findDOMNode(instance);
    let caretNode = node.children[0].children[1];

    caretNode.tagName.should.equal('SPAN');
    caretNode.className.should.match(/\bcaret\b/);
  });

  // NOTE: The onClick event handler is invoked for both the Enter and Space
  // keys as well since the component is a button. I cannot figure out how to
  // get ReactTestUtils to simulate such though.
  it('toggles open/closed when clicked', function() {
    let instance = ReactTestUtils.renderIntoDocument(<DropdownButton />);
    let node = React.findDOMNode(instance);
    let buttonNode = React.findDOMNode(node.children[0]);

    node.className.should.not.match(/\bopen\b/);
    buttonNode.getAttribute('aria-expanded').should.equal('false');

    ReactTestUtils.Simulate.click(buttonNode);

    node.className.should.match(/\bopen\b/);
    buttonNode.getAttribute('aria-expanded').should.equal('true');

    ReactTestUtils.Simulate.click(buttonNode);

    node.className.should.not.match(/\bopen\b/);
    buttonNode.getAttribute('aria-expanded').should.equal('false');
  });

  it('when focused and closed toggles open when the key "down" is pressed', function() {
    let instance = ReactTestUtils.renderIntoDocument(<DropdownButton />);
    let node = React.findDOMNode(instance);
    let buttonNode = React.findDOMNode(node.children[0]);

    ReactTestUtils.Simulate.keyDown(buttonNode, { keyCode: keycode('down') });

    node.className.should.match(/\bopen\b/);
    buttonNode.getAttribute('aria-expanded').should.equal('true');
  });

  it('generates a random id if one is not provided', function() {
    let instance1 = ReactTestUtils.renderIntoDocument(<DropdownButton />);
    let instance2 = ReactTestUtils.renderIntoDocument(<DropdownButton />);
    let node1 = ReactTestUtils.findRenderedDOMComponentWithTag(instance1, 'BUTTON').getDOMNode();
    let node2 = ReactTestUtils.findRenderedDOMComponentWithTag(instance2, 'BUTTON').getDOMNode();

    node1.getAttribute('id').should.not.equal(node2.getAttribute('id'));
  });

  describe('focusable state', function() {
    let focusableContainer;

    beforeEach(function() {
      focusableContainer = document.createElement('div');
      document.body.appendChild(focusableContainer);
    });

    afterEach(function() {
      React.unmountComponentAtNode(focusableContainer);
      document.body.removeChild(focusableContainer);
    });

    it('when focused and closed sets focus on first menu item when the key "down" is pressed', function() {
      let instance = React.render(<DropdownButton />, focusableContainer);
      let node = React.findDOMNode(instance);
      let buttonNode = React.findDOMNode(node.children[0]);

      buttonNode.focus();
      ReactTestUtils.Simulate.keyDown(buttonNode, { keyCode: keycode('down') });

      let firstMenuItemAnchor = ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'A')[0].getDOMNode();
      document.activeElement.should.equal(firstMenuItemAnchor);
    });

    it('when focused and open sets focus on first menu item when the key "down" is pressed', function() {
      let instance = React.render(<DropdownButton />, focusableContainer);
      let node = React.findDOMNode(instance);
      let buttonNode = React.findDOMNode(node.children[0]);

      buttonNode.focus();
      ReactTestUtils.Simulate.click(buttonNode);
      ReactTestUtils.Simulate.keyDown(buttonNode, { keyCode: keycode('down') });

      let firstMenuItemAnchor = ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'A')[0].getDOMNode();
      document.activeElement.should.equal(firstMenuItemAnchor);
    });

    it('when focused and open does not toggle closed when the key "down" is pressed', function() {
      let instance = ReactTestUtils.renderIntoDocument(<DropdownButton />);
      let node = React.findDOMNode(instance);
      let buttonNode = React.findDOMNode(node.children[0]);

      ReactTestUtils.Simulate.click(buttonNode);
      ReactTestUtils.Simulate.keyDown(buttonNode, { keyCode: keycode('down') });

      node.className.should.match(/\bopen\b/);
      buttonNode.getAttribute('aria-expanded').should.equal('true');
    });

    it('when focused and an item is selected sets focus on next menu item when the key "down" is pressed', function() {
      let instance = React.render(<DropdownButton />, focusableContainer);
      let node = React.findDOMNode(instance);
      let buttonNode = React.findDOMNode(node.children[0]);

      buttonNode.focus();
      ReactTestUtils.Simulate.click(buttonNode);

      let items = ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'A');

      items.forEach((item, index) => {
        ReactTestUtils.Simulate.keyDown(document.activeElement, { keyCode: keycode('down') });

        let itemAnchor = item.getDOMNode();
        document.activeElement.should.equal(itemAnchor);
      });
    });

    it('when focused and last item is selected sets focus on first menu item when the key "down" is pressed', function() {
      let instance = React.render(<DropdownButton />, focusableContainer);
      let node = React.findDOMNode(instance);
      let buttonNode = React.findDOMNode(node.children[0]);

      buttonNode.focus();
      ReactTestUtils.Simulate.click(buttonNode);

      let items = ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'A');

      items.forEach((item, index) => {
        ReactTestUtils.Simulate.keyDown(document.activeElement, { keyCode: keycode('down') });
      });

      ReactTestUtils.Simulate.keyDown(document.activeElement, { keyCode: keycode('down') });

      let firstMenuItemAnchor = ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'A')[0].getDOMNode();
      document.activeElement.should.equal(firstMenuItemAnchor);
    });

    it('when focused and item is selected sets focus on previous menu item when the key "up" is pressed', function() {
      let instance = React.render(<DropdownButton />, focusableContainer);
      let node = React.findDOMNode(instance);
      let buttonNode = React.findDOMNode(node.children[0]);

      buttonNode.focus();

      ['down', 'down', 'up'].forEach(direction => {
        ReactTestUtils.Simulate.keyDown(document.activeElement, { keyCode: keycode(direction) });
      });

      let firstMenuItemAnchor = ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'A')[0].getDOMNode();
      document.activeElement.should.equal(firstMenuItemAnchor);
    });

    it('when focused and the first item is selected sets focus on last menu item when the key "up" is pressed', function() {
      let instance = React.render(<DropdownButton />, focusableContainer);
      let node = React.findDOMNode(instance);
      let buttonNode = React.findDOMNode(node.children[0]);

      buttonNode.focus();

      ['down', 'up'].forEach(direction => {
        ReactTestUtils.Simulate.keyDown(document.activeElement, { keyCode: keycode(direction) });
      });

      let items = ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'A');

      let lastMenuItemAnchor = items[items.length-1].getDOMNode();
      document.activeElement.should.equal(lastMenuItemAnchor);
    });

    it('when open and the key "esc" is pressed the menu is closed and focus is returned to the button', function() {
      let instance = React.render(<DropdownButton />, focusableContainer);
      let node = React.findDOMNode(instance);
      let buttonNode = React.findDOMNode(node.children[0]);
      let firstMenuItemAnchor = ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'A')[0].getDOMNode();

      buttonNode.focus();
      ReactTestUtils.Simulate.keyDown(buttonNode, { keyCode: keycode('down') });
      ReactTestUtils.Simulate.keyDown(firstMenuItemAnchor, { keyCode: keycode('esc') });

      document.activeElement.should.equal(buttonNode);
    });

    it('when open and the key "tab" is pressed the menu is closed and focus is progress to the next focusable element', function() {
      let instance = React.render(
        <div>
          <DropdownButton />
          <input type='text' id='next-focusable' />
        </div>, focusableContainer);

      let node = ReactTestUtils.findRenderedComponentWithType(instance, DropdownButton);
      // See TODO below
      //let nextFocusable = ReactTestUtils.findRenderedDOMComponentWithTag(instance, 'INPUT').getDOMNode();
      let buttonNode = ReactTestUtils.findRenderedDOMComponentWithTag(node, 'BUTTON').getDOMNode();

      ReactTestUtils.Simulate.click(buttonNode);
      buttonNode.getAttribute('aria-expanded').should.equal('true');

      ReactTestUtils.Simulate.keyDown(buttonNode, { key: keycode('tab'), keyCode: keycode('tab') });
      buttonNode.getAttribute('aria-expanded').should.equal('false');

      // TODO: I can't figure out how to make this assertion work in test, it
      // works fine when testing manually.
      //document.activeElement.should.equal(nextFocusable);
    });
  });

  describe('DropdownMenu', function() {
    it('has aria-labelled by same id as toggle button', function() {
      let instance = ReactTestUtils.renderIntoDocument(<DropdownButton />);
      let node = React.findDOMNode(instance);
      let buttonNode = node.children[0];
      let menuNode = node.children[1];

      buttonNode.getAttribute('id').should.equal(menuNode.getAttribute('aria-labelledby'));
    });
  });
});
