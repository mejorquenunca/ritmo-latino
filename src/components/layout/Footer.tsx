'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Mic2, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Acerca de Vasílala', href: '/about' },
      { label: 'Cómo funciona', href: '/how-it-works' },
      { label: 'Términos de servicio', href: '/terms' },
      { label: 'Política de privacidad', href: '/privacy' },
      { label: 'Política de cookies', href: '/cookies' },
    ],
    creators: [
      { label: 'Para Artistas', href: '/for-artists' },
      { label: 'Para DJs', href: '/for-djs' },
      { label: 'Para Locales', href: '/for-venues' },
      { label: 'Para Organizadores', href: '/for-organizers' },
      { label: 'Centro de Ayuda', href: '/help' },
    ],
    community: [
      { label: 'Blog', href: '/blog' },
      { label: 'Eventos Destacados', href: '/featured-events' },
      { label: 'Artistas Destacados', href: '/featured-artists' },
      { label: 'Comunidad', href: '/community' },
      { label: 'Contacto', href: '/contact' },
    ],
    legal: [
      { label: 'Derechos de Autor', href: '/copyright' },
      { label: 'Reportar Contenido', href: '/report' },
      { label: 'Seguridad', href: '/safety' },
      { label: 'Accesibilidad', href: '/accessibility' },
    ]
  };

  const socialLinks = [
    { 
      icon: <Instagram className="h-5 w-5" />, 
      href: 'https://instagram.com/vasilala', 
      label: 'Instagram' 
    },
    { 
      icon: <Facebook className="h-5 w-5" />, 
      href: 'https://facebook.com/vasilala', 
      label: 'Facebook' 
    },
    { 
      icon: <Twitter className="h-5 w-5" />, 
      href: 'https://twitter.com/vasilala', 
      label: 'Twitter' 
    },
    { 
      icon: <Youtube className="h-5 w-5" />, 
      href: 'https://youtube.com/vasilala', 
      label: 'YouTube' 
    },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      {/* Newsletter y CTA */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-yellow-500 mb-2">
                ¡Únete a la revolución de la música latina!
              </h3>
              <p className="text-gray-400 mb-4">
                Descubre nuevos artistas, eventos exclusivos y conecta con la comunidad latina más vibrante.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup">
                  <Button className="btn-vasilala-primary w-full sm:w-auto">
                    Crear Cuenta Gratis
                  </Button>
                </Link>
                <Link href="/for-artists">
                  <Button variant="outline" className="w-full sm:w-auto border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">
                    Soy Artista
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center space-x-2 text-yellow-500 mb-4">
                <Mic2 className="h-8 w-8" />
                <span className="text-3xl font-bold">Vasílala</span>
              </div>
              <p className="text-gray-400 text-sm">
                La plataforma que conecta el mundo con el ritmo latino
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enlaces principales */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Plataforma */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Plataforma</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Para Creadores */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Para Creadores</h4>
            <ul className="space-y-2">
              {footerLinks.creators.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidad */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Comunidad</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto y Redes */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Conecta con nosotros</h4>
            
            {/* Información de contacto */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>hola@vasilala.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+57 (1) 234-5678</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Bogotá, Colombia</span>
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Síguenos en:</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Footer inferior */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-gray-400">
              © {currentYear} Vasílala. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              {footerLinks.legal.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="text-gray-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Hecho con</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>para la música latina</span>
          </div>
        </div>
      </div>
    </footer>
  );
};