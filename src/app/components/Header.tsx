// @ts-nocheck
"use client"
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTwitter,faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faBars } from '@fortawesome/free-solid-svg-icons';
library.add(faTwitter, faGithub, faLinkedin, faBars, faEnvelope);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
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
                <a href="/"  className="text-white font-mono hover:underline" >
                <span>HOME</span>
                </a>
            </li>
            <li className="mb-2">
                <a href="/#skills"  className="text-white font-mono hover:underline" >
                <span>SKILLS</span>
                </a>
            </li>
            <li  className="mb-2">
                <a href="/#project"  className="text-white font-mono hover:underline">
                <span>PROJETOS</span>
                </a>
            </li>
            <li className="mb-2 md:mb-20">
                <a href="/blog" className="text-white font-mono hover:underline">
                <span>BLOG</span>
                </a>
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
  );
};

export default Header;

