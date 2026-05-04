// [path]: components/dashboard/UniversalSearch.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Car, UserSquare, Package, X } from 'lucide-react';
import { getProjects, getInventoryItems } from '@/lib/data-service';
import Link from 'next/link';

interface Client {
  name: string;
  slug: string;
}

const UniversalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  const allProjects = useMemo(() => getProjects(), []);
  const allInventory = useMemo(() => getInventoryItems(), []);
  
  const allClients = useMemo(() => {
    const clientsMap = new Map<string, Client>();
    allProjects.forEach(p => {
      if (!clientsMap.has(p.customerName)) {
        clientsMap.set(p.customerName, {
          name: p.customerName,
          slug: p.customerName.toLowerCase().replace(/\s+/g, '-'),
        });
      }
    });
    return Array.from(clientsMap.values());
  }, [allProjects]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query) return null;

    const lowerCaseQuery = query.toLowerCase();

    const projects = allProjects.filter(p =>
      `${p.car.year} ${p.car.make} ${p.car.model}`.toLowerCase().includes(lowerCaseQuery) ||
      p.customerName.toLowerCase().includes(lowerCaseQuery)
    );

    const clients = allClients.filter(c =>
      c.name.toLowerCase().includes(lowerCaseQuery)
    );

    const inventory = allInventory.filter(i =>
      i.name.toLowerCase().includes(lowerCaseQuery) ||
      i.sku.toLowerCase().includes(lowerCaseQuery)
    );

    return { projects, clients, inventory };
  }, [query, allProjects, allClients, allInventory]);

  return (
    <>
      <div className="relative w-full max-w-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full text-left bg-white border border-[var(--border-light)] rounded-[var(--radius-md)] py-2.5 px-4 text-[var(--system-gray)] hover:text-[var(--shark)] hover:border-[var(--border)] flex items-center justify-between transition-colors shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 shrink-0" />
            <span className="text-[15px]">Search...</span>
          </div>
          <kbd className="text-xs text-[var(--system-gray-2)] border border-[var(--border-light)] rounded px-1.5 py-0.5">⌘K</kbd>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative bg-white border border-[var(--border-light)] w-full max-w-2xl rounded-[var(--radius-lg)] shadow-[var(--shadow-large)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Find job, client, or part..."
                  autoFocus
                  className="w-full bg-transparent p-4 pl-12 text-[var(--shark)] placeholder-[var(--system-gray)] focus:outline-none text-[15px]"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--system-gray)]" />
                <button onClick={() => setIsOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--system-gray)] hover:text-[var(--shark)] p-1 rounded-[var(--radius-sm)]">
                    <X className="h-5 w-5"/>
                </button>
              </div>

              {searchResults && (
                <div className="border-t border-[var(--border-light)] max-h-96 overflow-y-auto">
                  {searchResults.projects.length === 0 && searchResults.clients.length === 0 && searchResults.inventory.length === 0 ? (
                    <p className="p-4 text-center text-[var(--system-gray)] text-sm">No results found.</p>
                  ) : (
                    <>
                      {searchResults.projects.length > 0 && (
                        <div>
                          <h3 className="px-4 py-2 text-xs font-semibold text-[var(--system-gray)] uppercase tracking-wide">Jobs</h3>
                          <ul>{searchResults.projects.map(p => (
                            <li key={p.id}><Link href={`/dashboard/projects/${p.id}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-[var(--athens-gray)] text-[var(--shark)]"><Car className="h-4 w-4 shrink-0 text-[var(--primary)]" /><span>{p.car.year} {p.car.make} {p.car.model}</span></Link></li>
                          ))}</ul>
                        </div>
                      )}
                      {searchResults.clients.length > 0 && (
                        <div>
                          <h3 className="px-4 py-2 text-xs font-semibold text-[var(--system-gray)] uppercase tracking-wide">Clients</h3>
                          <ul>{searchResults.clients.map(c => (
                            <li key={c.slug}><Link href={`/dashboard/clients/${c.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-[var(--athens-gray)] text-[var(--shark)]"><UserSquare className="h-4 w-4 shrink-0 text-[var(--primary)]" /><span>{c.name}</span></Link></li>
                          ))}</ul>
                        </div>
                      )}
                      {searchResults.inventory.length > 0 && (
                        <div>
                          <h3 className="px-4 py-2 text-xs font-semibold text-[var(--system-gray)] uppercase tracking-wide">Inventory</h3>
                          <ul>{searchResults.inventory.map(i => (
                            <li key={i.id}><Link href="/dashboard/inventory" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-[var(--athens-gray)] text-[var(--shark)]"><Package className="h-4 w-4 shrink-0 text-[var(--primary)]" /><span>{i.name}</span></Link></li>
                          ))}</ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UniversalSearch;