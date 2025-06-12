import { INSTRUMENTS } from '../lib/constants';

export default function AuthFields({
  username,
  setUsername,
  password,
  setPassword,
  instrument,
  setInstrument,
  loading,
  focusColor = 'blue',
  isAdmin = false
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-${focusColor}-500 focus:border-transparent`}
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-${focusColor}-500 focus:border-transparent`}
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {instrument ? 
            `Selected: ${INSTRUMENTS.find(i => i.name.toLowerCase() === instrument)?.emoji} ${instrument}` : 
            isAdmin ? 'Primary Instrument' : 'Instrument'}
        </label>
        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-${focusColor}-500 focus:border-transparent`}
          required
          disabled={loading}
        >
          <option value="">Select your instrument</option>
          {INSTRUMENTS.map((inst) => (
            <option key={inst.name} value={inst.name.toLowerCase()}>
              {inst.emoji} {inst.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 