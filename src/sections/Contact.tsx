import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, User, MessageSquare, CheckCircle, AlertCircle, Github, Instagram, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again or contact me directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('kiezzyee@gmail.com');
      setEmailCopied(true);
      toast.success('Email copied to clipboard!');
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy email');
    }
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github className="w-6 h-6" />,
      url: 'https://github.com/kiezz',
      color: 'hover:text-gray-400'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      url: 'https://www.instagram.com/ki3zzy?igsh=ZXdsdXF5ZmtmcXBq',
      color: 'hover:text-pink-400'
    }
  ];

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-black to-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-500 mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Got a project in mind? Want to collaborate? Or just want to say hi? 
            I'd love to hear from you. Let's build something amazing together!
          </p>
        </motion.div>

        {/* Contact Info & Social */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Direct Contact */}
            <div className="glass-effect p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Get in touch directly</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Email</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white">kiezzyee@gmail.com</span>
                      <button
                        onClick={copyEmailToClipboard}
                        className="p-1 rounded hover:bg-gray-700 transition-colors group"
                        title="Copy email to clipboard"
                      >
                        {emailCopied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-pink-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-effect p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Find me online</h3>
              <div className="space-y-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, x: 10 }}
                    className={`flex items-center gap-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all ${social.color}`}
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      {social.icon}
                    </div>
                    <span className="font-medium">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div className="glass-effect p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Fun Fact</h3>
              <p className="text-gray-400 leading-relaxed">
                I usually respond to emails within 24 hours, unless I'm deep in a coding session 
                or exploring a new creative project. Let's build something amazing together! 🚀
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;