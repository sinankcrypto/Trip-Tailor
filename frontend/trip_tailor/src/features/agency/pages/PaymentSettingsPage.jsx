import { useAgencyPaymentSettings } from "../../payments/hooks/useAgencyPaymentSettings";

const AgencyPaymentSettingsPage = () => {
  const {
    settings,
    loading,
    error,
    processing,
    handleConnect,
    handleDisconnect,
  } = useAgencyPaymentSettings();

  if (loading) return <p className="p-6 text-gray-600">Loading payment settings...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const isConnected = !!settings?.connected;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Payment Settings
      </h1>

      <div className="bg-white shadow rounded-lg p-6 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-lg font-medium text-gray-800">
              Stripe Connection Status:
            </p>
            <p
              className={`text-sm mt-1 ${
                isConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {isConnected ? "✅ Connected to Stripe" : "⚠️ Not Connected"}
            </p>
          </div>
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              disabled={processing}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {processing ? "Disconnecting..." : "Disconnect"}
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={processing}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {processing ? "Redirecting..." : "Connect Stripe"}
            </button>
          )}
        </div>

        {isConnected && (
          <div className="border-t pt-4 text-sm text-gray-600">
            <p>
              <strong>Stripe Account ID:</strong> {settings.account.id}
            </p>
            {settings.connected ? (
              <p className="text-green-600 mt-2">
                ✔ Details Submitted
              </p>
            ) : (
              <p className="text-yellow-600 mt-2">
                ⚠ Details not yet completed on Stripe
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyPaymentSettingsPage;
