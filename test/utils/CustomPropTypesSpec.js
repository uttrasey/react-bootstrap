import React from 'react';
import CustomPropTypes from '../../src/utils/CustomPropTypes';

describe('CustomPropTypes', function() {
  describe('all', function() {
    let validators;
    const props = {
      key: 'value'
    };
    const propName = 'key';
    const componentName = 'TestComponent';

    beforeEach(function() {
      validators = [
        sinon.stub(),
        sinon.stub(),
        sinon.stub()
      ];
    });

    it('with no arguments provided', function() {
      expect(() => {
        CustomPropTypes.all()
      }).to.throw(Error, /No validations provided/);
    });

    it('with no validations provided', function() {
      expect(() => {
        CustomPropTypes.all([])
      }).to.throw(Error, /No validations provided/);
    });

    it('with invalid arguments provided', function() {
      expect(() => {
        CustomPropTypes.all(1)
      }).to.throw(Error, /Invalid argument must be an array/);
    });

    it('validates each validation', function() {
      const all = CustomPropTypes.all(validators);

      let result = all(props, propName, componentName);
      expect(result).to.equal(undefined);

      validators.forEach(x => {
        x.should.have.been.calledOnce
          .and.calledWith(props, propName, componentName);
      });
    });

    it('returns first validation failure', function() {
      let err = new Error('Failure');
      validators[1].returns(err);
      const all = CustomPropTypes.all(validators);

      let result = all(props, propName, componentName);
      expect(result).to.equal(err);

      validators[0].should.have.been.calledOnce
        .and.calledWith(props, propName, componentName);

      validators[1].should.have.been.calledOnce
        .and.calledWith(props, propName, componentName);

      validators[2].should.not.have.been.called;
    });
  });
});
