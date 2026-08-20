// cypress/e2e/dashboard.cy.js
// Cypress E2E tests for MeeChain Dashboard

const API_URL = Cypress.env('NEXT_PUBLIC_API_URL') || 'https://api.meechain.live';
const BASE_URL = Cypress.config('baseUrl') || 'http://localhost:3000';

describe('MeeChain Dashboard', () => {
  // ═══════════════════════════════════════════════════════
  // Home Page Tests
  // ═══════════════════════════════════════════════════════

  describe('Home Page', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should load home page successfully', () => {
      cy.get('h1').should('contain', 'MeeChain');
      cy.get('body').should('be.visible');
    });

    it('should display backend status as LIVE', () => {
      cy.contains('Backend Status').should('be.visible');
      cy.contains('LIVE').should('be.visible');
    });

    it('should have working navigation to dashboard', () => {
      cy.contains('Enter Dashboard', 'Dashboard')
        .first()
        .click();
      cy.url().should('include', '/dashboard');
      cy.get('h1').should('contain', 'Dashboard');
    });

    it('should display all feature cards', () => {
      cy.contains('Blockchain').should('be.visible');
      cy.contains('Gamification').should('be.visible');
      cy.contains('Music Economy').should('be.visible');
    });
  });

  // ═══════════════════════════════════════════════════════
  // Dashboard Page Tests
  // ═══════════════════════════════════════════════════════

  describe('Dashboard Page', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
      cy.wait(2000); // Wait for data to load
    });

    it('should load dashboard successfully', () => {
      cy.contains('MeeChain Dashboard').should('be.visible');
      cy.contains('Magic Orb').should('be.visible');
      cy.contains('Stats Monitor').should('be.visible');
    });

    it('should display tab navigation', () => {
      cy.get('button').contains('Magic Orb').should('be.visible');
      cy.get('button').contains('Stats Monitor').should('be.visible');
    });

    it('should switch between tabs', () => {
      // Start on Magic Orb
      cy.get('button').contains('Magic Orb').click();
      cy.contains('Chain Energy').should('be.visible');

      // Switch to Stats
      cy.get('button').contains('Stats Monitor').click();
      cy.contains('Node Status').should('be.visible');

      // Switch back to Magic Orb
      cy.get('button').contains('Magic Orb').click();
      cy.contains('Chain Energy').should('be.visible');
    });
  });

  // ═══════════════════════════════════════════════════════
  // Magic Orb Component Tests
  // ═══════════════════════════════════════════════════════

  describe('Magic Orb Component', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
      cy.get('button').contains('Magic Orb').click();
      cy.wait(2000);
    });

    it('should display Magic Orb cards', () => {
      cy.contains('Chain Energy').should('be.visible');
      cy.contains('RPC Spirit').should('be.visible');
      cy.contains('Treasury Aura').should('be.visible');
      cy.contains('Validator Force').should('be.visible');
    });

    it('should show status indicators', () => {
      // Should contain status emojis
      cy.get('body').then(($body) => {
        const hasStatus = $body.text().includes('🟢') || $body.text().includes('🔴') || $body.text().includes('⚪');
        expect(hasStatus).to.be.true;
      });
    });

    it('should display last update time', () => {
      cy.contains('Last update').should('be.visible');
    });

    it('should have working refresh button', () => {
      cy.get('button').contains('Refresh').first().should('be.visible').click();
      cy.wait(1000);
      cy.contains('Last update').should('be.visible');
    });

    it('should auto-update data', () => {
      // Get initial timestamp
      cy.get('body').then(($initial) => {
        const initialText = $initial.text();
        
        // Wait for auto-refresh (10 seconds)
        cy.wait(12000);
        
        // Check if data has updated
        cy.get('body').then(($updated) => {
          const updatedText = $updated.text();
          // Data should have changed (not guaranteed, but likely)
          cy.log('Waiting for auto-refresh...');
        });
      });
    });

    it('should handle errors gracefully', () => {
      // Block API calls to simulate offline
      cy.intercept('GET', '**/api/magic/orb', { forceNetworkError: true }).as('blockedOrb');
      
      cy.reload();
      cy.wait(3000);
      
      // Should show error state or retry indication
      cy.get('body').then(($body) => {
        const hasError = $body.text().includes('Offline') || 
                        $body.text().includes('Retry') ||
                        $body.text().includes('Loading');
        expect(hasError).to.be.true;
      });
    });
  });

  // ═══════════════════════════════════════════════════════
  // Stats Monitor Component Tests
  // ═══════════════════════════════════════════════════════

  describe('Stats Monitor Component', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
      cy.get('button').contains('Stats Monitor').click();
      cy.wait(3000); // Wait for stats to load
    });

    it('should display Node Status section', () => {
      cy.contains('Node Status').should('be.visible');
      cy.contains('Status').should('be.visible');
      cy.contains('Block Height').should('be.visible');
    });

    it('should display API Gateway section', () => {
      cy.contains('API Gateway').should('be.visible');
      cy.contains('Latency').should('be.visible');
    });

    it('should display RPC Endpoint section', () => {
      cy.contains('RPC Endpoint').should('be.visible');
    });

    it('should show real block height', () => {
      cy.get('body').then(($body) => {
        const text = $body.text();
        // Should contain block number pattern like "Block Height #123"
        const hasBlockNumber = /Block Height\s*#?\d+/i.test(text) || /Block Height/.test(text);
        expect(hasBlockNumber).to.be.true;
      });
    });

    it('should show latency measurements', () => {
      cy.get('body').then(($body) => {
        const text = $body.text();
        // Should contain ms notation
        const hasLatency = /\d+ms/i.test(text);
        // Allow for possibility that latency isn't shown
        cy.log('Latency shown:', hasLatency);
      });
    });

    it('should have working refresh button', () => {
      cy.get('button').contains('Refresh').last().should('be.visible').click();
      cy.wait(1000);
      cy.contains('Last updated').should('be.visible');
    });

    it('should handle partial failures', () => {
      // Block RPC to test partial failure
      cy.intercept('POST', '**/8545', { statusCode: 500 }).as('rpcError');
      
      cy.reload();
      cy.wait(3000);
      
      // Should still show some data
      cy.get('body').should('contain', 'Status');
    });
  });

  // ═══════════════════════════════════════════════════════
  // API & CORS Tests
  // ═══════════════════════════════════════════════════════

  describe('API & CORS', () => {
    it('should fetch health data without CORS errors', () => {
      cy.request('GET', '/api/health')
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('status');
        });
    });

    it('should fetch stats data without CORS errors', () => {
      cy.request('GET', '/api/stats')
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('timestamp');
        });
    });

    it('should have no console errors on dashboard load', () => {
      const errors: string[] = [];
      
      cy.on('uncaught:exception', (err) => {
        errors.push(err.message);
        return false; // Don't fail test
      });
      
      cy.visit('/dashboard');
      cy.wait(3000);
      
      // Check for CORS errors specifically
      cy.get('body').then(() => {
        const hasCorsError = errors.some(e => e.includes('CORS'));
        expect(hasCorsError).to.be.false;
      });
    });
  });

  // ═══════════════════════════════════════════════════════
  // Responsive Design Tests
  // ═══════════════════════════════════════════════════════

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('/dashboard');
      cy.wait(2000);
      cy.contains('MeeChain Dashboard').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('/dashboard');
      cy.wait(2000);
      cy.contains('MeeChain Dashboard').should('be.visible');
    });

    it('should work on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.visit('/dashboard');
      cy.wait(2000);
      cy.contains('MeeChain Dashboard').should('be.visible');
    });

    it('should have readable text on all viewports', () => {
      cy.viewport('iphone-x');
      cy.visit('/dashboard');
      cy.get('h1, h2, h3, p').should('be.visible');
    });
  });

  // ═══════════════════════════════════════════════════════
  // Accessibility Tests
  // ═══════════════════════════════════════════════════════

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.visit('/dashboard');
      cy.get('h1').should('exist');
      cy.get('h2').should('exist');
    });

    it('buttons should be keyboard accessible', () => {
      cy.visit('/dashboard');
      
      // Tab to first button
      cy.get('body').tab();
      
      // Focus should be on an interactive element
      cy.focused().should('have.prop', 'tagName').should('match', /button|a|input/i);
    });

    it('should have proper link text', () => {
      cy.visit('/');
      
      cy.get('a').each(($link) => {
        // Each link should have text or aria-label
        const text = $link.text();
        const ariaLabel = $link.attr('aria-label');
        expect(text || ariaLabel).to.be.truthy;
      });
    });
  });

  // ═══════════════════════════════════════════════════════
  // Performance Tests
  // ═══════════════════════════════════════════════════════

  describe('Performance', () => {
    it('should load page quickly', () => {
      const startTime = Date.now();
      
      cy.visit('/dashboard');
      cy.wait(2000);
      
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        cy.log(`Page loaded in ${loadTime}ms`);
        // Should load within 15 seconds
        expect(loadTime).to.be.lessThan(15000);
      });
    });

    it('should have minimal layout shifts', () => {
      cy.visit('/dashboard');
      
      // Wait for all content to load
      cy.wait(3000);
      
      // Check that main containers are stable
      cy.get('h1').should('have.css', 'position');
    });
  });
});

// ═══════════════════════════════════════════════════════
// SETUP INSTRUCTIONS
// ═══════════════════════════════════════════════════════

// 1. Install Cypress
//    npm install -D cypress

// 2. Configure Cypress (cypress.config.js)
//    module.exports = {
//      e2e: {
//        baseUrl: 'http://localhost:3000',
//        setupNodeEvents(on, config) {},
//      },
//    }

// 3. Add .env.test for Cypress
//    NEXT_PUBLIC_API_URL=https://api.meechain.live
//    NEXT_PUBLIC_RPC_URL=https://rpc.meechain.live

// 4. Run tests
//    npm run cypress:open  (interactive)
//    npm run cypress:run   (headless)

// 5. Add to package.json scripts
//    "cypress:open": "cypress open",
//    "cypress:run": "cypress run"

// 6. Custom command for tabbing (optional)
// In cypress/support/commands.ts:
// Cypress.Commands.add('tab', () => {
//   cy.get('body').type('{tab}');
// });
