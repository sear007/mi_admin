import React, { PureComponent } from 'react';
import {  View, Text } from 'react-native';

export default class EditScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {route} = this.props;
    const {post_id} = route.params;
    return (
      <View>
        <Text> {post_id} </Text>
      </View>
    );
  }
}
