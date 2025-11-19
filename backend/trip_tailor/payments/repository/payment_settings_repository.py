import stripe

class PaymentSettingsRepository:
    @staticmethod
    def create_express_account_for_agency(agency, email=None):
        """
        Create a Stripe Express account for the agency if it doesn't exist.
        Returns the stripe account id (acct_...).
        """

        if agency.stripe_account_id:
            return agency.stripe_account_id
        
        account = stripe.Account.create(
            type="express",
            country="US",
            email=email or agency.user.email if getattr(agency, "user", None) else None,
            capabilities={
                "card_payments":{"requested": True},
                "transfers":{"requested": True}
            }
        )
        agency.stripe_account_id = account.id
        agency.save(update_fields=["stripe_account_id"])
        return account.id

    @staticmethod
    def create_account_link(stripe_account_id, refresh_url, return_url):
        """
        Create an account_link for onboarding. Returns the URL.
        """

        link = stripe.AccountLink.create(
            account=stripe_account_id,
            refresh_url=refresh_url,
            return_url=return_url,
            type="account_onboarding",
        )
        return link.url
    
    @staticmethod
    def get_account_status(stripe_account_id):
        """
        Retrieve Stripe account details (safe to call). Return a dict of useful status fields.
        """

        if not stripe_account_id:
            return {"connected":False}
        
        acct = stripe.Account.retrieve(stripe_account_id)
        return {
            "connected": True,
            "charges_enabled": acct.get("charges_enabled"),
            "payouts_enabled": acct.get("payouts_enabled"),
            "requirements": acct.get("requirements", {}),
            "account": {
                "id": acct.get("id"),
                "business_type": acct.get("business_type"),
                "email": acct.get("email"),
            },
        }
    
    @staticmethod
    def disconnect_agency_account(agency):
        """
        Remove the stripe_account_id from the agency. Does NOT delete Stripe account.
        """
        agency.stripe_account_id = None
        agency.save(update_fields=["stripe_account_id"])
        return True