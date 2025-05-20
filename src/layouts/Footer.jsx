'use client'

import React from 'react'
import FOOTER_SECTIONS from '../constants/footer'


export default function Footer() {
    return (
        <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
            <aside>
                <p>
                    D.R DIEU PHAN D.C.
                    <br />
                    Helping people move better, pain-free.
                </p>
            </aside>

            {Object.entries(FOOTER_SECTIONS).map(([sectionTitle, links]) => (
                <nav key={sectionTitle}>
                    <h6 className="footer-title">{sectionTitle}</h6>
                    {links.map((link) => (
                        <a key={link.name} href={link.href} className="link link-hover">
                            {link.name}
                        </a>
                    ))}
                </nav>
            ))}
        </footer>
    );
}
