import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const sendMessage = useMutation(api.messages.send);
  const about = useQuery(api.about.get);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Save to Convex Database (Shows up in Admin Dashboard)
      await sendMessage({ 
        name: formData.name, 
        email: formData.email, 
        message: formData.message 
      });

      // 2. Trigger Real Email send from Backend Express Server
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        await fetch(`${backendUrl}/api/contact/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (err) {
        console.error("Email API failed (is node server running on 5000?):", err);
      }

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert("Error sending message.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's <span className="text-primary">Connect</span></h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Contact Info Side */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">Get in Touch</h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Whether you want to discuss a project, have an opportunity for me, or just want to say hi, my inbox is always open. I'll try my best to get back to you!
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/30 border border-primary/30 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Email</p>
                <a href={`mailto:${about?.email || "boggrapusai1@gmail.com"}`} className="text-white text-lg font-medium hover:text-primary transition-colors break-all">
                  {about?.email || "boggrapusai1@gmail.com"}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary/10 to-secondary/30 border border-secondary/30 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Phone</p>
                <a href={`tel:${about?.phone || "8885007602"}`} className="text-white text-lg font-medium hover:text-secondary transition-colors">
                  {about?.phone || "8885007602"}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/10 to-cyan-500/30 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-[#00e5ff] group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Location</p>
                <p className="text-white text-lg font-medium">
                  {about?.location || "Punganur, Andhra Pradesh, India"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 md:p-10">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thanks for reaching out. I'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder-gray-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder-gray-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Message</label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder-gray-500 resize-none"
                    placeholder="How can I help you?"
                  />
                </div>
                
                <div className="pt-4 text-center">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-12 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/40 transition-all disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </div>
              </form>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
