﻿import React, { Component } from 'react';
export class SvgComponent extends Component {
    render() {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                viewBox="0 0 100 100"
            >
            <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="blue"/>
            </svg>
        )
    }
}