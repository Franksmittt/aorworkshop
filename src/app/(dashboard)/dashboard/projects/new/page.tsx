'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, ListChecks, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { addProject } from '@/lib/data-service';
import { VehicleChecklist } from '@/lib/types';
import { FITMENT_CATEGORIES, buildCategoriesFromFitmentIds } from '@/lib/fitment-categories';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ImageUploader from '@/components/dashboard/ImageUploader';

const FUEL_LEVELS = ['Full', '3/4', '1/2', '1/4', 'Empty'];

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [customerName, setCustomerName] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelLevel, setFuelLevel] = useState('');
  const [photosOnArrival, setPhotosOnArrival] = useState<string[]>([]);
  const [selectedFitmentIds, setSelectedFitmentIds] = useState<string[]>([]);

  const toggleFitment = (id: string) => {
    setSelectedFitmentIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const addPhoto = (base64: string) => {
    setPhotosOnArrival(prev => [...prev, base64]);
  };

  const removePhoto = (index: number) => {
    setPhotosOnArrival(prev => prev.filter((_, i) => i !== index));
  };

  const canProceedStep1 = customerName.trim() && carMake.trim() && carModel.trim() && carYear.trim() && numberPlate.trim() && mileage.trim() && fuelLevel;
  const canProceedStep3 = selectedFitmentIds.length > 0;

  const handleCreate = () => {
    if (!canProceedStep1 || !canProceedStep3) return;
    const year = parseInt(carYear, 10);
    const km = parseInt(mileage, 10);
    if (isNaN(year) || isNaN(km)) return;

    const vehicleChecklist: VehicleChecklist = {
      mileageIn: km,
      fuelLevel,
      keysReceived: true,
      photosOnArrival: photosOnArrival.length > 0 ? photosOnArrival : undefined,
      completedAt: new Date().toISOString(),
    };

    const categories = buildCategoriesFromFitmentIds(selectedFitmentIds);

    addProject({
      customerName: customerName.trim(),
      car: {
        make: carMake.trim(),
        model: carModel.trim(),
        year,
        numberPlate: numberPlate.trim(),
        mileageIn: km,
      },
      vehicleChecklist,
      status: 'Active',
      createdAt: new Date().toISOString(),
      categories,
      timeline: [{ id: `t-${Date.now()}`, date: new Date().toISOString(), update: 'Vehicle booked in. Photos captured. Fitment work added.', category: 'Check-in' }],
      media: [],
      messages: [],
      financials: { invoices: [], totalQuoted: 0, totalPaid: 0 },
    });
    router.push('/dashboard/projects');
  };

  const steps = [
    { number: 1, title: 'Customer & Vehicle', icon: User },
    { number: 2, title: 'Photos of vehicle', icon: Camera },
    { number: 3, title: 'Fitment work', icon: ListChecks },
    { number: 4, title: 'Review & Create', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-hero text-[var(--shark)] tracking-tight">Book new vehicle</h1>
        <p className="text-caption text-[var(--system-gray)] mt-1.5">
          Customer details, check-in photos, and fitment work. Protects you and the customer.
        </p>
      </header>

      <div className="card p-4 mb-8 rounded-[var(--radius-lg)]">
        <ol className="flex items-center justify-between gap-2">
          {steps.map((s, index) => (
            <li key={s.number} className="flex items-center gap-2 flex-1">
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] shrink-0 transition-samsung ${
                  step >= s.number ? 'bg-[var(--primary)] text-white' : 'bg-[var(--athens-gray)] text-[var(--system-gray)]'
                }`}
              >
                <s.icon className="w-5 h-5" />
              </span>
              <span className={`text-sm font-medium hidden sm:inline ${step >= s.number ? 'text-[var(--shark)]' : 'text-[var(--system-gray)]'}`}>
                {s.title}
              </span>
              {index < steps.length - 1 && <span className="flex-1 h-px bg-[var(--border-light)] mx-1" />}
            </li>
          ))}
        </ol>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: [0.22, 0.25, 0, 1] }}
          className="card p-6 md:p-8 rounded-[var(--radius-lg)]"
        >
          {step === 1 && (
            <>
              <h2 className="text-title text-[var(--shark)] mb-6">Customer & vehicle details</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Customer full name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input placeholder="Make (e.g. Toyota)" value={carMake} onChange={e => setCarMake(e.target.value)} />
                  <Input placeholder="Model (e.g. Hilux)" value={carModel} onChange={e => setCarModel(e.target.value)} />
                  <Input placeholder="Year" type="number" value={carYear} onChange={e => setCarYear(e.target.value)} />
                </div>
                <Input placeholder="Number plate" value={numberPlate} onChange={e => setNumberPlate(e.target.value)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Mileage (km)" type="number" value={mileage} onChange={e => setMileage(e.target.value)} />
                  <div>
                    <label className="block text-sm font-medium text-[var(--shark)] mb-1">Fuel level</label>
                    <select
                      value={fuelLevel}
                      onChange={e => setFuelLevel(e.target.value)}
                      className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-4 py-3 text-[var(--shark)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="">Select</option>
                      {FUEL_LEVELS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                  Next: Photos <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-title text-[var(--shark)] mb-2">Photos of vehicle (before work)</h2>
              <p className="text-caption text-[var(--system-gray)] mb-6">
                Take or upload multiple images. Covers existing damage and condition so there are no disputes later.
              </p>
              <ImageUploader onUploadComplete={addPhoto} />
              {photosOnArrival.length > 0 && (
                <div className="mt-6">
                  <p className="text-subhead text-[var(--shark)] mb-2">{photosOnArrival.length} photo(s) added</p>
                  <div className="flex flex-wrap gap-3">
                    {photosOnArrival.map((url, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-light)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Check-in ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[var(--error)] text-white flex items-center justify-center"
                          aria-label="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Next: Select fitment work <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-title text-[var(--shark)] mb-2">What will be done</h2>
              <p className="text-caption text-[var(--system-gray)] mb-6">
                Select all fitment work for this vehicle. You can assign and track each item as a task.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FITMENT_CATEGORIES.map(fit => (
                  <label
                    key={fit.id}
                    className={`flex items-center gap-3 p-4 rounded-[var(--radius-md)] border cursor-pointer transition-samsung ${
                      selectedFitmentIds.includes(fit.id)
                        ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                        : 'border-[var(--border-light)] hover:bg-[var(--athens-gray)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFitmentIds.includes(fit.id)}
                      onChange={() => toggleFitment(fit.id)}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedFitmentIds.includes(fit.id) ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--system-gray-2)]'
                    }`}>
                      {selectedFitmentIds.includes(fit.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </span>
                    <span className="font-medium text-[var(--shark)]">{fit.name}</span>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)} disabled={!canProceedStep3}>
                  Review & create <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-title text-[var(--shark)] mb-6">Review & create job</h2>
              <div className="space-y-4 text-[var(--shark)]">
                <p><strong>Customer:</strong> {customerName}</p>
                <p><strong>Vehicle:</strong> {carYear} {carMake} {carModel} — {numberPlate}</p>
                <p><strong>Mileage:</strong> {mileage} km · <strong>Fuel:</strong> {fuelLevel}</p>
                <p><strong>Photos on arrival:</strong> {photosOnArrival.length}</p>
                <p><strong>Fitment work:</strong> {selectedFitmentIds.length} — {selectedFitmentIds.map(id => FITMENT_CATEGORIES.find(f => f.id === id)?.name).filter(Boolean).join(', ')}</p>
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={handleCreate}>Create job</Button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
