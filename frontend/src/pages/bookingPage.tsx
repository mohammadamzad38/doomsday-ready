import { useEffect, useState } from "react";
import type { Cinema, BookingQuote } from "../types/cinema.types";
import { getCinemas, getBookingQuote } from "../services/cinemas.api";

export default function BookingPage() {
  const [error, setError] = useState("");
  const [groupSize, setGroupSize] = useState("6");
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [booking, setBooking] = useState<BookingQuote | null>(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const data = await getCinemas();

        setCinemas(data);
      } catch (error) {
        console.error("Fetch cinemas error:", error);
        setError("Failed to load cinemas.");
      } finally {
        setLoadingCinemas(false);
      }
    };

    fetchCinemas();
  }, []);

  const handleBooking = async () => {
    const size = Number(groupSize);

    if (!selectedCinema) {
      setError("Please select a cinema.");
      return;
    }

    if (!Number.isInteger(size) || size < 1 || size > 10000) {
      setError("Group size must be between 1 and 10,000.");
      return;
    }

    try {
      setLoadingBooking(true);
      setError("");
      setBooking(null);

      const data = await getBookingQuote(selectedCinema, size);

      setBooking(data);
    } catch (error: any) {
      console.error("Booking error:", error);

      setError(
        error.response?.data?.message || "Failed to generate booking quote.",
      );
    } finally {
      setLoadingBooking(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Opening Night Booking</h1>

        <p className="mt-2 text-gray-500">
          Find the exact bundle combination for your watch party.
        </p>
      </div>

      <section className="space-y-5 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Booking Details</h2>

        <div className="space-y-2">
          <label className="font-medium">Select Cinema</label>

          <select
            value={selectedCinema}
            onChange={(e) => {
              setSelectedCinema(e.target.value);
              setBooking(null);
              setError("");
            }}
            disabled={loadingCinemas}
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              {loadingCinemas ? "Loading cinemas..." : "Choose a cinema"}
            </option>

            {cinemas.map((cinema) => (
              <option key={cinema._id} value={cinema._id}>
                {cinema.name} — Bundles: {cinema.bundleSizes.join(", ")}
              </option>
            ))}
          </select>

          {!loadingCinemas && cinemas.length === 0 && (
            <p className="text-sm text-orange-600">
              No cinemas available. Please create a cinema first.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-medium">Group Size</label>

          <input
            type="number"
            min="1"
            max="10000"
            value={groupSize}
            onChange={(e) => {
              setGroupSize(e.target.value);
              setBooking(null);
              setError("");
            }}
            placeholder="Enter number of people"
            className="w-full rounded-lg border p-3"
          />

          <p className="text-sm text-gray-500">
            Minimum 1, maximum 10,000 people.
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleBooking}
          disabled={loadingBooking || loadingCinemas || cinemas.length === 0}
          className="rounded-lg cursor-pointer bg-blue-600 px-6 py-3 font-medium text-white disabled:opacity-50"
        >
          {loadingBooking ? "Calculating..." : "Get Booking Quote"}
        </button>
      </section>

      {booking && (
        <section className="space-y-5 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Booking Result</h2>

          {booking.possible ? (
            <>
              <div className="rounded-lg bg-green-50 p-5 text-green-800">
                <p className="font-medium">Exact combination found!</p>

                <p className="mt-2 text-3xl font-bold">
                  {booking.totalBundles} Bundles
                </p>

                <p>Group size: {booking.groupSize} people</p>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Bundle Breakdown</h3>

                <div className="space-y-2">
                  {Array.isArray(booking.bundleBreakdown) &&
                    booking.bundleBreakdown.map((item) => (
                      <div
                        key={item.bundleSize}
                        className="flex justify-between rounded-lg border p-4"
                      >
                        <span>{item.bundleSize} seats per bundle</span>

                        <span className="font-semibold">× {item.quantity}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Total seats</p>

                <p className="text-xl font-bold">{booking.groupSize}</p>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-red-50 p-5 text-red-700">
              <h3 className="font-semibold">Exact booking not possible</h3>

              <p className="mt-2">
                {booking.message ||
                  `No exact bundle combination is available for ${booking.groupSize} people.`}
              </p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
