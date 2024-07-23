// Filename: index.js
// Combined code from all files

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, Alert } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 20;
const CELL_SIZE = width / GRID_SIZE;

const getRandomCoordinates = (exclude) => {
    let x, y;
    do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
    } while (exclude.some(coord => coord.x === x && coord.y === y));
    return { x, y };
};

const initialState = () => ({
    snake: [{ x: 2, y: 2 }],
    food: getRandomCoordinates([{ x: 2, y: 2 }]),
    direction: 'RIGHT',
    speed: 200,
    gameOver: false
});

const SnakeGame = () => {
    const [state, setState] = useState(initialState());

    useEffect(() => {
        if (state.gameOver) {
            Alert.alert('Game Over', 'Do you want to play again?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => setState(initialState()) }
            ]);
            return;
        }

        const timer = setInterval(moveSnake, state.speed);
        return () => clearInterval(timer);
    }, [state]);

    const moveSnake = () => {
        let snake = [...state.snake];
        let head = snake[0];

        switch (state.direction) {
            case 'RIGHT':
                head = { x: head.x + 1, y: head.y };
                break;
            case 'LEFT':
                head = { x: head.x - 1, y: head.y };
                break;
            case 'UP':
                head = { x: head.x, y: head.y - 1 };
                break;
            case 'DOWN':
                head = { x: head.x, y: head.y + 1 };
                break;
        }

        if (head.x >= GRID_SIZE || head.y >= GRID_SIZE || head.x < 0 || head.y < 0 ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            setState(prevState => ({ ...prevState, gameOver: true }));
            return;
        }

        snake.unshift(head);

        if (head.x === state.food.x && head.y === state.food.y) {
            const newFood = getRandomCoordinates(snake);
            setState(prevState => ({
                ...prevState,
                snake: snake,
                food: newFood
            }));
        } else {
            snake.pop();
            setState(prevState => ({ ...prevState, snake }));
        }
    };

    const changeDirection = (newDirection) => {
        const oppositeDirections = {
            'UP': 'DOWN',
            'DOWN': 'UP',
            'LEFT': 'RIGHT',
            'RIGHT': 'LEFT'
        };

        if (oppositeDirections[state.direction] !== newDirection) {
            setState(prevState => ({ ...prevState, direction: newDirection }));
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    changeDirection('UP');
                    break;
                case 'ArrowDown':
                    changeDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    changeDirection('LEFT');
                    break;
                case 'ArrowRight':
                    changeDirection('RIGHT');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.direction]);

    return (
        <View style={styles.gameContainer}>
            {state.snake.map((segment, index) => (
                <View
                    key={index}
                    style={[
                        styles.snakeSegment,
                        { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE }
                    ]}
                />
            ))}
            <View
                style={[
                    styles.food,
                    { left: state.food.x * CELL_SIZE, top: state.food.y * CELL_SIZE }
                ]}
            />
        </View>
    );
};

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    gameContainer: {
        width: width,
        height: width,
        position: 'relative',
        backgroundColor: '#000',
    },
    snakeSegment: {
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'limegreen',
    },
    food: {
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
    },
});

export default App;