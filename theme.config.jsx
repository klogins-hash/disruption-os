export default {
  logo: <span>🛡️ Disruption OS</span>,
  project: {
    link: 'https://github.com/klogins-hash/disruption-os'
  },
  docsRepositoryBase: 'https://github.com/klogins-hash/disruption-os',
  footer: {
    text: 'WORM-Based Versioning System | Git + PostgreSQL + Nextra'
  },
  primaryHue: 210,
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Disruption OS'
    }
  }
}
