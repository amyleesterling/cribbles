import ResourceCard, { type Resource } from "./resource-card";
import { motion } from "framer-motion";

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="font-display font-semibold text-xl mb-2">No resources found</h3>
        <p className="text-gray-500">
          Try adjusting your search or category filters to find what you're looking for.
        </p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </motion.div>
  );
}
