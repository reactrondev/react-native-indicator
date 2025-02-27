import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { Surface } from "@react-native-community/art";
import AnimatedCircle from '../animated/AnimatedCircle';
import { color } from '../const';

export default class OpacityDotsLoader extends React.PureComponent {
	static propTypes = {
		color: PropTypes.string,
		size: PropTypes.number,
		betweenSpace: PropTypes.number,
		speed: PropTypes.number,
	};

	static defaultProps = {
		color,
		size: 10,
		betweenSpace: 5,
		speed: 200,
	};

	state = {
		opacity: [new Animated.Value(0.5), new Animated.Value(0.5), new Animated.Value(0.5)]
	};

	_renderCircle(i) {
		const { color, size, betweenSpace } = this.props;
		return (
			<AnimatedCircle
				radius={size}
				fill={color}
				x={size / 2 + i * (size + betweenSpace)}
				y={size / 2}
				opacity={this.state.opacity[i]}
				scale={1}
			/>
		);
	}

	componentDidMount() {
		this._animation();
	}

	componentWillUnmount() {
		this.unmounted = true;
	}

	_animation = () => {
		const { speed } = this.props;

		function seq(self, i) {
			return Animated.sequence([
				Animated.timing(self.state.opacity[i], {
					toValue: 1,
					duration: speed,
					delay: i * speed
				}),
				Animated.timing(self.state.opacity[i], {
					toValue: 0.3,
					duration: speed,
					delay: speed
				})
			])
		}

		Animated.parallel([
			seq(this, 0), seq(this, 1), seq(this, 2)
		]).start(() => {
			!this.unmounted && this._animation();
		});
	};

	render() {
		const { size, betweenSpace } = this.props;
		return (
			<Surface width={size * 3 + betweenSpace * 2} height={size}>
				{this._renderCircle(0)}
				{this._renderCircle(1)}
				{this._renderCircle(2)}
			</Surface>
		);
	}
}
