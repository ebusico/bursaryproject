var stubComponent = function(componentClass) {
  var originalPropTypes;

  beforeEach(function() {
    originalPropTypes = componentClass.propTypes;

    componentClass.propTypes = {};

    spyOn(componentClass.prototype, 'render').and.returnValue(null);
    spyOn(componentClass.prototype, 'componentWillMount').and.returnValue(null);
    spyOn(componentClass.prototype, 'componentDidMount').and.returnValue(null);
    spyOn(componentClass.prototype, 'componentWillReceiveProps').and.returnValue(null);
    spyOn(componentClass.prototype, 'shouldComponentUpdate').and.returnValue(null);
    spyOn(componentClass.prototype, 'componentWillUpdate').and.returnValue(null);
    spyOn(componentClass.prototype, 'componentDidUpdate').and.returnValue(null);
    spyOn(componentClass.prototype, 'componentWillUnmount').and.returnValue(null);
  });

  afterEach(function() {
    componentClass.propTypes = originalPropTypes;
  });
};

module.exports = {
  stubComponent: stubComponent
};