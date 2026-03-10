document.addEventListener('DOMContentLoaded', function() {
    const payButton = document.getElementById('payButton');
    
    payButton.addEventListener('click', payWithPaystack);
    
    function payWithPaystack() {
      const ref = 'TICKET_' + Date.now();
      
      const handler = PaystackPop.setup({
        key: 'MUSceF2PkQIZQw0+q2HgCFEU16Rw4DKE', 
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
  });
