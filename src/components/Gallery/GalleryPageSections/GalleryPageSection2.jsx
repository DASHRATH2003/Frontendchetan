import React, { useState, useEffect, useCallback, useContext } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import GalleryContext from "../../../context/GalleryContext";

const GalleryPageSection2 = () => {
  const {
    gallery,
    loading: contextLoading,
    error: contextError,
    refreshGallery,
    clearLocalStorage
  } = useContext(GalleryContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Effect to load gallery data
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        // Clear any old data from localStorage if the function is available
        if (typeof clearLocalStorage === 'function') {
          clearLocalStorage();
        }
        // Fetch fresh data from backend
        await refreshGallery();
      } catch (err) {
        console.error('Error loading gallery:', err);
        setError('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []); // Only run on mount

  const handleImageClick = (index) => setCurrentIndex(index);
  const handleCloseModal = () => setCurrentIndex(null);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
  }, [gallery.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
  }, [gallery.length]);

  const handleTouchStart = (e) => {
    if (e?.targetTouches?.[0]) {
      setTouchStart(e.targetTouches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e?.targetTouches?.[0]) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    e?.preventDefault?.();
    const swipeDistance = touchStart - touchEnd;

    if (swipeDistance > 150) {
      handleNext();
    } else if (swipeDistance < -150) {
      handlePrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") handleCloseModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, handleNext, handlePrev]);

  if (loading || contextLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || contextError) {
    return (
      <div className="text-center py-10 text-red-500">
        {error || contextError}
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {gallery.map((image, index) => (
          <div
            key={image._id || index}
            className="relative group overflow-hidden rounded-lg cursor-pointer aspect-square"
          >
            <img
              src={image.imageUrl}
              alt={image.alt || image.title || "Gallery image"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onClick={() => handleImageClick(index)}
            />
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-sm font-medium">{image.title}</h3>
                {image.description && <p className="text-xs mt-1">{image.description}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {currentIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <div
              className="w-full h-full flex items-center justify-center touch-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={gallery[currentIndex].imageUrl}
                alt={gallery[currentIndex].alt || gallery[currentIndex].title || "Gallery image"}
                className="max-w-full max-h-full object-contain pointer-events-none"
              />
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <h3 className="text-lg font-medium">{gallery[currentIndex].title}</h3>
              {gallery[currentIndex].description && (
                <p className="text-sm mt-1 max-w-md mx-auto">{gallery[currentIndex].description}</p>
              )}
            </div>
            <button
              className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-50 hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
              onClick={handleCloseModal}
            >
              <X size={24} />
            </button>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-700 bg-opacity-50 hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-700 bg-opacity-50 hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryPageSection2;
