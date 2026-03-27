document.addEventListener('DOMContentLoaded', function() {
    const payButton = document.getElementById('payButton');
    const paypalButton = document.getElementById('paypalButton');
    const stripeButton = document.getElementById('stripeButton');
    const nestlinkButton = document.getElementById('nestlinkButton');

    payButton.addEventListener('click', payWithPaystack);
    paypalButton.addEventListener('click', () => alert('PayPal flow not implemented in this demo yet.'));
    stripeButton.addEventListener('click', () => alert('Stripe flow not implemented in this demo yet.'));
    nestlinkButton.addEventListener('click', payWithNestlink);
    
    function payWithPaystack() {
      const ref = 'TICKET_' + Date.now();
      
      const handler = PaystackPop.setup({
        key: 'pk_live_19caaea5b3f865073305c366d05254d3f50bcf1a', 
        email: 'customer@example.com', 
        amount: 5000, // Amount in kobo (50 USD)
        currency: 'USD',
        ref: ref,
        label: "Event Ticket Payment",
        callback: function(response) {
          alert(`Payment successful! Reference: ${response.reference}`);
        },
        onClose: function() {
          alert('Payment was not completed. You can try again.');
        }
      });
      
      handler.openIframe();
    }

    async function payWithNestlink() {
      const apiKey = '1128448808887f7df327818b';
      const baseAmountUSD = 50.00;
      const processingFeeUSD = Number((baseAmountUSD * 0.03).toFixed(2)); // 3% processing fee example
      const totalAmountUSD = Number((baseAmountUSD + processingFeeUSD).toFixed(2));

      const payload = {
        amount: totalAmountUSD,
        currency: 'USD',
        description: 'Event Ticket Payment (includes processing fee)',
        customer: {
          email: 'customer@example.com',
          name: 'Ticket Buyer'
        },
        metadata: {
          payment_method: 'nestlink',
          base_amount: baseAmountUSD,
          processing_fee: processingFeeUSD
        },
        callback_url: window.location.href
      };

      try {
        const response = await fetch('https://api.nestlink.io/v1/payment-links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Nestlink API error: ${response.status} ${errText}`);
        }

        const data = await response.json();
        const paymentUrl = data?.data?.url || data?.url;

        if (!paymentUrl) {
          throw new Error('Nestlink payment link not returned by API');
        }

        // redirect user to Nestlink payment page
        window.location.href = paymentUrl;
      } catch (error) {
        console.error(error);
        alert(`Could not create Nestlink payment link: ${error.message}`);
      }
    }
  });