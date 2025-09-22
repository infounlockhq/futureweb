import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  index: number;
}

export function ServiceCard({ title, description, icon: Icon, gradient, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="service-card p-8 rounded-xl group cursor-pointer"
      data-testid={`card-service-${index}`}
    >
      <div className={`w-16 h-16 ${gradient} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
