'use client';

import { useState } from 'react';
import { 
  HelpCircle, 
  Mail, 
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  Clock,
  CheckCircle
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Sidebar,
  Input,
  Label,
  Separator,
  Badge
} from '@/components';
import NavigationWrapper from './NavigationWrapper';

export default function Ayuda() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      id: 1,
      question: "¿Cómo puedo crear un nuevo expediente?",
      answer: "Para crear un nuevo expediente, ve a la sección 'Expedientes' y haz clic en el botón 'Nuevo Expediente'. Completa la información requerida del cliente y los detalles del caso. El sistema generará automáticamente un número de expediente único."
    },
    {
      id: 2,
      question: "¿Cómo configuro recordatorios de plazos?",
      answer: "En la sección 'Plazos', puedes agregar nuevos plazos y configurar recordatorios. El sistema te notificará por email y en la aplicación cuando se acerquen las fechas de vencimiento. Puedes personalizar estos recordatorios en Configuración > Notificaciones."
    },
    {
      id: 3,
      question: "¿Puedo exportar mis datos?",
      answer: "Sí, puedes exportar tus datos en varios formatos (PDF, Excel, CSV) desde la sección 'Reportes'. También puedes configurar respaldos automáticos en Configuración > Sistema."
    },
    {
      id: 4,
      question: "¿Cómo cambio mi contraseña?",
      answer: "Ve a Configuración > Seguridad y haz clic en 'Cambiar Contraseña'. Ingresa tu contraseña actual y la nueva contraseña. Asegúrate de que cumpla con los requisitos de seguridad mostrados."
    },
    {
      id: 5,
      question: "¿Puedo usar el sistema en mi móvil?",
      answer: "Sí, el sistema es completamente responsive y funciona en dispositivos móviles, tablets y computadoras. Puedes acceder desde cualquier navegador web en tu dispositivo móvil."
    },
    {
      id: 6,
      question: "¿Cómo contacto soporte técnico?",
      answer: "Puedes contactarnos a través del formulario de contacto en esta página. Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00."
    },
    {
      id: 7,
      question: "¿Mis datos están seguros?",
      answer: "Sí, utilizamos encriptación de extremo a extremo y cumplimos con todas las regulaciones de protección de datos. Tus datos se almacenan en servidores seguros y solo tú tienes acceso a ellos."
    },
    {
      id: 8,
      question: "¿Puedo personalizar la interfaz?",
      answer: "Sí, en Configuración > Apariencia puedes cambiar el tema, idioma, formato de fechas y otras preferencias de visualización para adaptar la interfaz a tus necesidades."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium'
    });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <NavigationWrapper>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Centro de Ayuda</h1>
                <p className="text-gray-600 mt-2">Encuentra respuestas a tus preguntas o contacta con nuestro equipo de soporte</p>
              </div>
              

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* FAQ Section */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Preguntas Frecuentes
                      </CardTitle>
                      <CardDescription>
                        Encuentra respuestas rápidas a las preguntas más comunes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Search */}
                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Buscar en preguntas frecuentes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* FAQ List */}
                      <div className="space-y-2">
                        {filteredFaqs.map((faq) => (
                          <div key={faq.id} className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => toggleFaq(faq.id)}
                              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <span className="font-medium text-gray-900">{faq.question}</span>
                              {expandedFaq === faq.id ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                            {expandedFaq === faq.id && (
                              <div className="px-4 pb-3 text-gray-600 text-sm">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Form */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Contactar Soporte
                      </CardTitle>
                      <CardDescription>
                        Envíanos tu consulta y te responderemos en menos de 24 horas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isSubmitted ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
                          <p className="text-gray-600">Hemos recibido tu consulta y te responderemos pronto.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nombre</Label>
                              <Input
                                id="name"
                                value={contactForm.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Tu nombre completo"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="tu@email.com"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="subject">Asunto</Label>
                            <Input
                              id="subject"
                              value={contactForm.subject}
                              onChange={(e) => handleInputChange('subject', e.target.value)}
                              placeholder="Resumen de tu consulta"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="priority">Prioridad</Label>
                            <select
                              id="priority"
                              value={contactForm.priority}
                              onChange={(e) => handleInputChange('priority', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="low">Baja</option>
                              <option value="medium">Media</option>
                              <option value="high">Alta</option>
                              <option value="urgent">Urgente</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="message">Mensaje</Label>
                            <textarea
                              id="message"
                              value={contactForm.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              placeholder="Describe tu consulta o problema en detalle..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-vertical"
                              required
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Clock className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Enviar Consulta
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Información de Contacto</CardTitle>
                    <CardDescription>
                      Contacta con nuestro equipo de soporte
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-sm text-gray-600 mb-2">soporte@abogados.com</p>
                      <p className="text-xs text-gray-500">Respuesta en 24 horas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}
