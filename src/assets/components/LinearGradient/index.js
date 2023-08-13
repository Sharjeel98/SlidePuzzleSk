import React from 'react';
import {View} from 'react-native';

const LinearGradient = props => {
  const {colors, style} = props;

  return (
    <View
      style={[
        style,
        {
          backgroundImage: `linear-gradient(to bottom, ${colors.join(',')})`,
        },
      ]}
    />
  );
};

export default LinearGradient;
