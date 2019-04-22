// Libraries
import React, { PureComponent } from 'react';

// Utils & Services
import { config } from 'app/core/config';

// Types
import { SingleStatOptions } from './types';
import { PanelProps, getFieldDisplayValues, VizRepeater, FieldDisplay, BigValue, DisplayValue } from '@grafana/ui';
import { BigValueSparkline } from '@grafana/ui/src/components/BigValue/BigValue';

export class SingleStatPanel extends PureComponent<PanelProps<SingleStatOptions>> {
  renderValue = (value: FieldDisplay, width: number, height: number): JSX.Element => {
    let sparkline: BigValueSparkline;
    if (value.sparkline) {
      const { timeRange, options } = this.props;

      sparkline = {
        ...options.sparkline,
        data: value.sparkline,
        minX: timeRange.from.valueOf(),
        maxX: timeRange.to.valueOf(),
      };
    }

    // TODO, fonts and colors
    let prefix: DisplayValue;
    let suffix: DisplayValue;

    if (value.prefix) {
      prefix = {
        text: value.prefix,
        numeric: NaN,
      };
    }
    if (value.suffix) {
      suffix = {
        text: value.suffix,
        numeric: NaN,
      };
    }

    return (
      <BigValue
        value={value.display}
        sparkline={sparkline}
        width={width}
        height={height}
        prefix={prefix}
        suffix={suffix}
        theme={config.theme}
      />
    );
  };

  getValues = (): FieldDisplay[] => {
    const { data, options, replaceVariables } = this.props;
    return getFieldDisplayValues({
      ...options,
      replaceVariables,
      theme: config.theme,
      data: data.series,
      sparkline: options.sparkline.show,
    });
  };

  render() {
    const { height, width, options, data, renderCounter } = this.props;
    return (
      <VizRepeater
        getValues={this.getValues}
        renderValue={this.renderValue}
        width={width}
        height={height}
        source={data}
        renderCounter={renderCounter}
        orientation={options.orientation}
      />
    );
  }
}
