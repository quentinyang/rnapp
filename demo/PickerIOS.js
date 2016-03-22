'use strict';

var React = require('react-native');
var {
  Picker,
  Text,
  View,
} = React;

var PickerItemIOS = Picker.Item;

var CAR_MAKES_AND_MODELS = {
  amc: {
    name: 'AMC',
    models: ['AMX', 'Concord', 'Eagle', 'Gremlin', 'Matador', 'Pacer'],
  },
  alfa: {
    name: 'Alfa-Romeo',
    models: ['159', '4C', 'Alfasud', 'Brera', 'GTV6', 'Giulia', 'MiTo', 'Spider'],
  },
  aston: {
    name: 'Aston Martin',
    models: ['DB5', 'DB9', 'DBS', 'Rapide', 'Vanquish', 'Vantage'],
  },
  audi: {
    name: 'Audi',
    models: ['90', '4000', '5000', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q5', 'Q7'],
  },
  austin: {
    name: 'Austin',
    models: ['America', 'Maestro', 'Maxi', 'Mini', 'Montego', 'Princess'],
  },
  borgward: {
    name: 'Borgward',
    models: ['Hansa', 'Isabella', 'P100'],
  },
  buick: {
    name: 'Buick',
    models: ['Electra', 'LaCrosse', 'LeSabre', 'Park Avenue', 'Regal',
             'Roadmaster', 'Skylark'],
  },
  cadillac: {
    name: 'Cadillac',
    models: ['Catera', 'Cimarron', 'Eldorado', 'Fleetwood', 'Sedan de Ville'],
  },
  chevrolet: {
    name: 'Chevrolet',
    models: ['Astro', 'Aveo', 'Bel Air', 'Captiva', 'Cavalier', 'Chevelle',
             'Corvair', 'Corvette', 'Cruze', 'Nova', 'SS', 'Vega', 'Volt'],
  },
};

var PickerExample = React.createClass({
  getInitialState: function() {
    return {
      carMake: 'cadillac',
      modelIndex: 3,
    };
  },

  render: function() {
    var make = CAR_MAKES_AND_MODELS[this.state.carMake];
    var selectionString = make.name + ' ' + make.models[this.state.modelIndex];
    return (
      <View>
        <Text style={{marginTop: 20, fontSize: 12,color: '#666'}}>//此示例中PickerIOS改为Picker测试通过，所以Picker具有通用性。</Text>
        <Text>Please choose a make for your car:</Text>
        <Picker
          selectedValue={this.state.carMake}
          onValueChange={(carMake) => this.setState({carMake, modelIndex: 0})}>
          {Object.keys(CAR_MAKES_AND_MODELS).map((carMake) => (
            <PickerItemIOS
              key={carMake}
              value={carMake}
              label={CAR_MAKES_AND_MODELS[carMake].name}
            />
          ))}
        </Picker>
        <Text>Please choose a model of {make.name}:</Text>
        <Picker
          selectedValue={this.state.modelIndex}
          key={this.state.carMake}
          onValueChange={(modelIndex) => this.setState({modelIndex})}>
          {CAR_MAKES_AND_MODELS[this.state.carMake].models.map((modelName, modelIndex) => (
            <PickerItemIOS
              key={this.state.carMake + '_' + modelIndex}
              value={modelIndex}
              label={modelName}
            />
          ))}
        </Picker>
        <Text>You selected: {selectionString}</Text>
      </View>
    );
  },
});

var PickerStyleExample = React.createClass({
  getInitialState: function() {
    return {
      carMake: 'cadillac',
      modelIndex: 0,
    };
  },

  render: function() {
    var make = CAR_MAKES_AND_MODELS[this.state.carMake];
    var selectionString = make.name + ' ' + make.models[this.state.modelIndex];
    return (
      <View>
        <Text style={{marginTop: 20, fontSize: 12,color: '#666'}}>//加的样式在iOS中有效，但在Android中无效。</Text>
        <Picker
          itemStyle={{fontSize: 25, color: 'red', textAlign: 'left', fontWeight: 'bold'}}
          selectedValue={this.state.carMake}
          onValueChange={(carMake) => this.setState({carMake, modelIndex: 0})}>
          {Object.keys(CAR_MAKES_AND_MODELS).map((carMake) => (
            <PickerItemIOS
              key={carMake}
              value={carMake}
              label={CAR_MAKES_AND_MODELS[carMake].name}
            />
          ))}
        </Picker>
      </View>
    );
  },
});

exports.displayName = (undefined: ?string);
exports.title = '<Picker>';
exports.description = 'Render lists of selectable options with UIPickerView.';
exports.examples = [
{
  title: '<Picker>',
  render: function(): ReactElement {
    return <PickerExample />;
  },
},
{
  title: '<Picker> with custom styling',
  render: function(): ReactElement {
    return <PickerStyleExample />;
  },
}];
