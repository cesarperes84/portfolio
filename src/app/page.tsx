// @ts-nocheck
"use client"
import React from "react";
import Header from './components/Header';
import Games from './components/Games';
import WebApps from './components/WebApps';
import WebSites from './components/WebSites';

const Home = () => (
    <div className="md:flex md:h-screen" >
      <Header />
    
      <main className="sm:w-full md:w-4/5 px-4 md:px-16 py-12 bg-black scroll-smooth" style={{ backgroundImage: "linear-gradient(rgba(34,34,34,0), rgba(0,0,0,0)), url(https://res.cloudinary.com/dqaojtmfr/image/upload/v1709747084/portfolio/4NB4.gif)", backgroundPosition: 'top right', backgroundRepeat: 'no-repeat',  backgroundSize: '600px 800px', overflowY: 'auto' }}>

        <header className="mb-20" id="skills" >
          <h2 className="font-mono text-white font-bold text-4xl  md:text-8xl mb-1 md:pb-4">Oi, </h2>
          <h2 className="font-mono text-white font-bold text-4xl md:text-8xl mb-1 md:pb-4">Sou o Cesar!</h2>
          <h2 className="font-mono text-white font-bold text-4xl md:text-8xl mb-1 md:pb-4">front-end</h2>
          <hr className="border-b-4 border-orange-red mb-14 w-20" />
          <p className="font-mono text-white font-bold md:text-xl md:w-2/3">Formado em Análise de Sistemas com mais de 15 anos de experiência com web, desde a criação de aplicações com foco em front-end e back-end quando for preciso</p>
        </header>

        <section  className="text-gray-300">
          <h3 className="font-mono text-orange-red font-bold text-2xl md:text-4xl mb-4">Skills</h3>
          <hr className="border-b-4 border-orange-red mb-14 w-20" />
          <div className="mb-10 md:w-2/3">
            <h3 className="text-xl font-bold font-mono">FRONT-END</h3>
                <span className="tag">HTML5</span><span className="tag"> LESS</span><span className="tag"> CSS</span><span className="tag"> Javascript</span><span className="tag"> ReactJs</span><span className="tag"> React Native</span><span className="tag"> NextJs</span><span className="tag"> AngularJs</span><span className="tag"> Svelte</span><span className="tag"> Vue</span><span className="tag">
    TypeScript</span><span className="tag"> GraphQL</span><span className="tag"> Apollo</span><span className="tag"> Styled-Components</span><span className="tag"> Tailwind</span><span className="tag"> Material-UI</span><span className="tag"> Chackra-UI</span><span className="tag"> SEO</span><span className="tag"> WordPress</span>
          </div>
          <div className="mb-10 md:w-2/3">
            <h3 className="text-xl font-bold font-mono">BACK-END</h3>
            <span className="tag">NodeJs</span><span className="tag"> Express</span><span className="tag"> PHP</span><span className="tag"> MYSQL</span><span className="tag"> MongoDB</span><span className="tag"> LARAVEL</span><span className="tag"> CodeIgniter</span><span className="tag">C#</span><span className="tag">Java</span>
          </div>
        </section>
        <Games />
        <WebApps />
        <WebSites />
      </main>
    </div>
);

export default Home;

