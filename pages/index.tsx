/*//pages/index.tsx*/
import React from 'react';

export default function HomePage() {
  return (
    <main className="bg-white text-[#051F5B] px-6 py-16 space-y-24">
      
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">Noise Off. Calm Think.</h1>
        <p className="text-lg text-gray-700">Explaining markets. Not just reporting them.</p>
        <div className="space-x-4 mt-4">
          <button className="bg-[#051F5B] text-white px-5 py-3 rounded">See a Demo</button>
          <button className="border border-[#051F5B] text-[#051F5B] px-5 py-3 rounded">How it Works</button>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">We reduce market noise — by explaining why.</h2>
        <p className="text-gray-600 text-base">
          Economic decisions aren’t made harder by a lack of data — but by too much noise.
          Wiserbond cuts through this noise, explains the logic behind headlines,
          and learns from its own predictions — so you don’t have to guess again.
        </p>
      </section>

      {/* Core Strengths */}
      <section>
        <h2 className="text-2xl font-semibold text-center mb-10">Our Core Strengths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="p-6 rounded-lg border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Explainable Insight</h3>
            <p className="text-gray-600">
              Analysis structured from Big → Mid → Small Picture. Each insight cites trusted sources and is explained in simple terms — tailored by industry.
            </p>
          </div>
          {/* Card 2 */}
          <div className="p-6 rounded-lg border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Recap & Learn</h3>
            <p className="text-gray-600">
              We automatically revisit predictions after 3–6 months and evaluate them with public data. Misses are analyzed to improve logic.
            </p>
          </div>
          {/* Card 3 */}
          <div className="p-6 rounded-lg border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Decision-Ready Insight</h3>
            <p className="text-gray-600">
              Strategy, risk factors, and industry impact are all covered. Comments suggest what to watch now based on macro trends.
            </p>
          </div>
          {/* Card 4 */}
          <div className="p-6 rounded-lg border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Co-Learning AI</h3>
            <p className="text-gray-600">
              User interpretations are stored and compared with AI. Over time, accuracy is tracked and ranking systems for forecasters are planned.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Ready to see how it works?</h2>
        <p className="text-gray-600">
          Let our forecasts prove themselves. Experience how we explain, predict, and improve.
        </p>
        <div className="space-x-4">
          <button className="bg-[#051F5B] text-white px-6 py-3 rounded">View Demo</button>
          <button className="bg-gray-100 text-[#051F5B] px-6 py-3 rounded">Try for Free</button>
          <button className="text-[#051F5B] underline">Join Waitlist</button>
        </div>
      </section>

    </main>
  );
}
