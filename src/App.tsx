// @ts-nocheck
import './App.css';
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { faTwitter,faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faBars } from '@fortawesome/free-solid-svg-icons';
library.add(faTwitter, faGithub, faLinkedin, faBars, faEnvelope);

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="md:flex md:h-screen" >
      <aside className="flex sm:w-full md:w-1/5 pb-0 pt-4 pr-4 bg-plus-gray text-right transition-all">
        <nav className="w-screen flex md:flex-col">

          <div className="flex flex-row w-full">
            <div className="visible md:hidden w-1/2 text-left ml-8" onClick={() => setIsOpen((prev) => !prev)}>
              <FontAwesomeIcon icon="fa-solid fa-bars"  size="lg" color="#ffff" />
            </div>

            <div className="w-1/2 md:w-full">
              <h1 className="text-orange-red font-bold font-mono text-xl tracking-widest md:mb-2">
                CESAR PERES
              </h1>
              <hr className="border-b-4 border-orange-red mb-2 md:mb-14 w-9 ml-[30px] md:ml-[215px]" />
            
              <ul className={`md:py-20 md:flex mt-8 flex-col ${isOpen ? "visible" : "hidden"} md:visible`}>
                <li className="mb-2">
                  <a href="#skills"  className="text-white font-mono hover:underline" >
                    <span>SKILLS</span>
                  </a>
                </li>
                <li  className="mb-2">
                  <a href="#project"  className="text-white font-mono hover:underline">
                    <span>PROJETOS</span>
                  </a>
                </li>
                <li className="mb-2 md:mb-20">
                  {/* <a href="http://www.cperes.com.br/blog" target="_blank"  className="text-white font-mono hover:underline">
                    <span>BLOG</span>
                  </a> */}
                </li>
                <li className="mb-2">
                  <div className="text-right md:flex-col inline-flex md:flex gap-2 md:mb-5">
                    <a href="mailto:contato@cperes.com.br" target="_blank" className="contact-icon">
                      <FontAwesomeIcon icon="fa-envelope" size="lg" color="#ffff" /> 
                    </a>
                    <a href="https://www.linkedin.com/in/cesar-peres-b0339967/" target="_blank" title="Linkedin" className="contact-icon">
                      <FontAwesomeIcon icon="fa-brands fa-linkedin" size="lg"  color="#ffff" />
                    </a>
                    <a href="https://github.com/cesarperes84" target="_blank" title="Github" className="contact-icon">
                      <FontAwesomeIcon icon="fa-brands fa-github" size="lg" color="#ffff" />
                    </a>
                    <a href="https://twitter.com/cesarperes84" target="_blank" title="Twitter" className="contact-icon">
                      <FontAwesomeIcon icon="fa-brands fa-twitter" size="lg" color="#ffff"/>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
         
        </nav>
      </aside>
    
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

        <section id="project" className="text-gray-300 mb-14">
          <div className="">
            <div className="mb-10 md:w-2/3">
                <h2 className="text-2xl md:text-4xl font-bold font-mono text-orange-red">Projetos</h2>
                <hr className="border-b-4 border-orange-red mb-14 w-20" />
                <p className="md:text-xl font-mono">Conheça um pouco dos projetos que participei ao longo dos últimos anos</p>
            </div>
            <div className="flex flex-wrap gap-x-0 gap-y-4 font-mono w-full md:-ml-4">
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("https://connectio.vercel.app/", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746737/portfolio/connect-io" className="img-responsive" alt="Connnect.io" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Web game "conecte os caminhos". 2022
                                </div>
                                <div className="project-category text-faded">
                                    Layout, HTML, CSS, Javascript, NextJs, ReactJs, TypeScript, Material-UI
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("https://novel-app-web.vercel.app/", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746737/portfolio/novel" className="img-responsive" alt="Novel" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Game quiz "qual a novela do dia". 2022
                                </div>
                                <div className="project-category text-faded">
                                    Layout, HTML, CSS, Javascript, NextJs, ReactJs, TypeScript, Material-UI, Axios
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("https://www.decoddr.cc/", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746737/portfolio/decoddr" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Mobile game diário "quebre a senha". 2022
                                </div>
                                <div className="project-category text-faded">
                                    Layout, HTML, CSS, Javascript, NextJs, ReactJs, TypeScript, Material-UI, Axios
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open('http://www.fortniteplayerstats.com', '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/fortnite" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Estatísticas de jogadores do Fortinte. 2021
                                </div>
                                <div className="project-category text-faded">
                                    Layout, HTML, CSS, Javascript, ReactJs, Bootstrap, Axios
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open('https://covid19-cperes.vercel.app/', '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/corona" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Estatísticas diárias da COVID19 no Brasil. 2020
                                </div>
                                <div className="project-category text-faded">
                                    Layout, HTML, CSS, Javascript, NextJs, ReactJs, Amcharts, TypeScript, Material-UI, Axios
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("bee/index.html", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/bee" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Web game inspirado no Flappy Bird. 2014
                                </div>
                                <div className="project-category text-faded">
                                    Layout, HTML, CSS, Javascript, Canvas
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("http://www.esocomprar.com.br", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/esocomprar" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Website de Cupons de Descontos. 2012
                                </div>
                                <div className="project-category text-faded">
                                    LAYOUT, HTML5, CSS, JQuery, PHP, MYSQL
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("http://www.pifferveiculos.com.br", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/piffer" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Website catálogo de consessionária de automóveis. 2016
                                </div>
                                <div className="project-category text-faded">
                                    HTML, Jquery, CSS, Wordpress
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("http://www.cameliaflores.com.br", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/camelia" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Ecommerce sobre Floricultura no RJ. 2018
                                </div>
                                <div className="project-category text-faded">
                                    HTML5, CSS, JQuery, PHP, MYSQL
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("http://www.dogwalk.com.br", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/dogwalk" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Website que conecta passeadores de cães aos donos de pet. 2015
                                </div>
                                <div className="project-category text-faded">
                                    HTML5, CSS, JQuery, PHP, MYSQL
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("http://www.divecom.com.br", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746357/portfolio/dive" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Website de catálogo de produtos de mergulho. 2016
                                </div>
                                <div className="project-category text-faded">
                                    HTML, Jquery, CSS, Wordpress
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div onClick={() => window.open("http://www.lafloricultura.com.br", '_blank')} className="portfolio-box">
                        <img src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/la-floricultura" className="img-responsive" alt="" />
                        <div className="portfolio-box-caption">
                            <div className="portfolio-box-caption-content">
                                <div className="project-name">
                                    Ecommerce sobre Floricultura no RJ. 2019
                                </div>
                                <div className="project-category text-faded">
                                    LAYOUT, HTML5, CSS, JQuery, PHP, MYSQL
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App;
