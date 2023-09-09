import React, { useEffect, useState } from 'react'
import './css/template.css';
import './css/Start.css';
import { useNavigate } from 'react-router-dom';

function Start () {
 
	const navigate = useNavigate();
	const timeout = () => {
		setTimeout(() => {
			navigate('/main');
		}, 3000);
	};
	useEffect(() => {
		timeout();
		return () => {
			clearTimeout(timeout);
		};
	}); 
  return (
    <div id="start_color">
        <img src="JOY3.svg" id="logo"></img>
        <img src="index.png" id="index"></img>
        </div>

  )
}



export default Start;

