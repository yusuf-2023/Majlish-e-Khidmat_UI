import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStats } from "../api/stats/statsApi";
import { getAllCampaigns } from "../api/Campaign/campaignApi";
import { listAllDonations } from "../api/donationApi";
import { getAllVolunteers } from "../api/Volunteer/volunteerApi";
import { getAllEvents } from "../api/event/eventApi";
import StatCard from "../components/StatCard";
import "../styles/home.css";

function Home({ darkMode }) {
  const [stats, setStats] = useState({
    activeVolunteers: 0,
    totalUsers: 0,
    donationsCollected: 0,
    campaigns: 0,
    inventoryItems: 0,
    feedbacks: 0,
  });
  const [campaigns, setCampaigns] = useState([]);
  const [events, setEvents] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [allVolunteers, setAllVolunteers] = useState([]); // Changed variable name to be more descriptive
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quote, setQuote] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeMissionTab, setActiveMissionTab] = useState(0);
  const [imageLoading, setImageLoading] = useState({});

  const API_BASE_URL = window.location.origin.includes('localhost') 
    ? "http://localhost:8080" 
    : window.location.origin;

  const quotes = [
    "Helping one person might not change the whole world, but it could change the world for one person.",
    "Small acts of kindness make a big difference.",
    "Be the reason someone smiles today.",
    "Charity begins at home but should not end there.",
    "Every good deed counts, no matter how small.",
    "Volunteer today for a better tomorrow.",
  ];

  const slides = [
    {
      title: "Your small help <br /> makes the world better",
      accent: "small help",
      description: "Empowering communities by supporting education, social causes and sustainable development."
    },
    {
      title: "Save the youth <br /> they need your help & support",
      accent: "the youth",
      description: "Join us to make opportunities universal & sustainable."
    },
    {
      title: "Your donation <br />helps change someone's life",
      accent: "donation",
      description: "Together, we can serve humanity with dedication."
    },
    {
      title: "Giving hope <br /> to those who truly need it",
      accent: "hope",
      description: "Every contribution, big or small, makes a lasting impact."
    },
    {
      title: "No Light, <br /> No Camera Only Action",
      accent: "Light",
      description: "Join hands and make a difference in lives today."
    },
    {
      title: "Majlish-e-Khidmat <br /> Serving with compassion & transparency",
      accent: "Majlish-e-Khidmat",
      description: "Empowering communities by creating sustainable opportunities."
    }
  ];

  const missionTabs = [
    {
      title: "Health & Wellness",
      icon: "fa-heart",
      description: "Providing healthcare services, medical camps, and health awareness programs to underserved communities.",
      initiatives: [
        "Free medical checkup camps",
        "Medicine distribution drives",
        "Health and hygiene awareness sessions",
        "Mental health support programs"
      ]
    },
    {
      title: "Education for All",
      icon: "fa-book",
      description: "Ensuring access to quality education for children and adults through various educational initiatives.",
      initiatives: [
        "After-school tutoring programs",
        "Scholarships for deserving students",
        "Digital literacy workshops",
        "Library and resource centers"
      ]
    },
    {
      title: "Islamic Education",
      icon: "fa-mosque",
      description: "Promoting Islamic knowledge, values, and spiritual development through comprehensive educational programs.",
      initiatives: [
        "Quran memorization (Hifz) programs",
        "Islamic studies classes for all ages",
        "Seerah and Hadith workshops",
        "Islamic ethics and character building"
      ]
    },
    {
      title: "Community Development",
      icon: "fa-hands-helping",
      description: "Empowering communities through skill development, infrastructure support, and social welfare programs.",
      initiatives: [
        "Vocational training programs",
        "Clean water and sanitation projects",
        "Women empowerment initiatives",
        "Elderly care and support"
      ]
    },
    {
      title: "Disaster Relief",
      icon: "fa-house-damage",
      description: "Providing immediate assistance and long-term support to communities affected by natural disasters.",
      initiatives: [
        "Emergency relief distribution",
        "Temporary shelter setup",
        "Rehabilitation programs",
        "Disaster preparedness training"
      ]
    }
  ];

  // Improved getImageUrl function
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    
    // Handle different URL formats
    if (imagePath.startsWith('http')) return imagePath;
    
    // Handle Windows paths
    if (imagePath.includes('\\')) {
      const filename = imagePath.split('\\').pop();
      return `${API_BASE_URL}/uploads/${filename}`;
    }
    
    // Handle simple filenames
    if (!imagePath.includes('/')) {
      return `${API_BASE_URL}/uploads/${imagePath}`;
    }
    
    // Handle relative paths
    return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  // Image loading handlers
  const handleImageLoad = (id) => {
    setImageLoading(prev => ({...prev, [id]: false}));
  };

  const handleImageError = (id) => {
    setImageLoading(prev => ({...prev, [id]: false}));
  };

  const loadAll = async () => {
    setRefreshing(true);
    try {
      const s = await fetchStats();
      setStats(s);

      // campaigns
      try {
        const c = await getAllCampaigns();
        setCampaigns(Array.isArray(c) ? c.slice(0, 3) : []);
      } catch (e) {
        setCampaigns([]);
      }

      // donors
      try {
        const donations = await listAllDonations();
        if (Array.isArray(donations)) {
          const sorted = [...donations].sort((a, b) => (b.amount || 0) - (a.amount || 0));
          setTopDonors(sorted.slice(0, 3));
        } else setTopDonors([]);
      } catch (e) {
        setTopDonors([]);
      }

      // volunteers
      try {
        const volunteers = await getAllVolunteers();
        if (Array.isArray(volunteers)) {
          // Changed this line to show all volunteers
          setAllVolunteers(volunteers); 
        } else setAllVolunteers([]);
      } catch (e) {
        setAllVolunteers([]);
      }

      // events
      try {
        const ev = await getAllEvents();
        setEvents(Array.isArray(ev) ? ev.slice(0, 5) : []);
      } catch (e) {
        setEvents([]);
      }

      // random quote
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    } catch (err) {
      console.error("Error loading home data:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    loadAll();
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    const quoteInterval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000);
    
    return () => {
      clearInterval(slideInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className={`home-page ${darkMode ? "dark" : ""}`}>
      {/* HERO */}
      <header className="hero">
        <div className="hero-inner">
          <div className="text-slider-container">
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className={`slide ${index === currentSlide ? "active" : ""}`}
              >
                <h1 dangerouslySetInnerHTML={{ 
                  __html: slide.title.replace(
                    slide.accent, 
                    `<span class="accent">${slide.accent}</span>`
                  ) 
                }} />
                <p>{slide.description}</p>
              </div>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="hero-ctas">
            <Link to="/donate" className="btn primary">Donate Now</Link>
            <Link to="/volunteer/register" className="btn outline">Become Volunteer</Link>
            {/* <Link to="/user/register" className="btn ghost">Register</Link>
            <Link to="/login" className="btn ghost">Login</Link> */}
          </div>
        </div>
        
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </header>

      {/* IMPACT NUMBERS */}
      <section className="impact">
        <div className="container">
          <h2>Our Impact</h2>
          <p className="muted">Working together to build better communities</p>
          <div className="impact-grid">
            <StatCard label="Active Volunteers" value={loading ? "..." : stats.activeVolunteers} />
            <StatCard label="Users" value={loading ? "..." : stats.totalUsers} />
            <StatCard label="Donations Collected" value={loading ? "..." : stats.donationsCollected} suffix="₹" />
            <StatCard label="Campaigns" value={loading ? "..." : stats.campaigns} />
            <StatCard label="Inventory Items" value={loading ? "..." : stats.inventoryItems} />
            <StatCard label="Feedbacks" value={loading ? "..." : stats.feedbacks} />
          </div>

          <div className="refresh-row">
            <button className={`btn small ${refreshing ? "disabled" : ""}`} onClick={loadAll} disabled={refreshing}>
              {refreshing ? "Refreshing..." : "🔄 Refresh Stats"}
            </button>
            <div className="quote">{quote}</div>
          </div>
        </div>
      </section>

      {/* CAMPAIGNS / CAUSES */}
      <section className="campaigns">
        <div className="container">
          <h2>You Can Help Lots of People By Donating Little</h2>
          <div className="campaign-grid">
            {loading ? (
              <div className="placeholder-grid">
                <div className="placeholder-card" />
                <div className="placeholder-card" />
                <div className="placeholder-card" />
              </div>
            ) : (
              campaigns.length > 0 ? campaigns.map((c, idx) => (
                <article key={c.id ?? idx} className="campaign-card">
                  {c.imageUrl ? <img src={c.imageUrl} alt={c.title || "campaign"} /> : <div className="card-hero" />}
                  <div className="card-body">
                    <h3>{c.title ?? `Campaign ${idx + 1}`}</h3>
                    <p className="muted">{c.shortDescription ?? c.description ?? "Support this cause."}</p>
                    <div className="card-actions">
                      <Link to={`/campaigns/${c.id}`} className="btn">View</Link>
                      <Link to="/donate" className="btn primary small">Donate</Link>
                    </div>
                  </div>
                </article>
              )) : (
                <React.Fragment>
                  <article className="campaign-card">
                    <div className="card-hero" />
                    <div className="card-body">
                      <h3>Education for All</h3>
                      <p className="muted">Help children get access to quality education.</p>
                      <div className="card-actions">
                        <Link to="/campaigns" className="btn">View</Link>
                        <Link to="/donate" className="btn primary small">Donate</Link>
                      </div>
                    </div>
                  </article>
                  <article className="campaign-card">
                    <div className="card-hero" />
                    <div className="card-body">
                      <h3>Healthcare Drive</h3>
                      <p className="muted">Support medical camps and basic healthcare.</p>
                      <div className="card-actions">
                        <Link to="/campaigns" className="btn">View</Link>
                        <Link to="/donate" className="btn primary small">Donate</Link>
                      </div>
                    </div>
                  </article>
                  <article className="campaign-card">
                    <div className="card-hero" />
                    <div className="card-body">
                      <h3>Community Support</h3>
                      <p className="muted">Join our local projects for community upliftment.</p>
                      <div className="card-actions">
                        <Link to="/campaigns" className="btn">View</Link>
                        <Link to="/donate" className="btn primary small">Donate</Link>
                      </div>
                    </div>
                  </article>
                </React.Fragment>
              )
            )}
          </div>
        </div>
      </section>

      {/* ACTIVE VOLUNTEERS SECTION */}
      <section className="active-volunteers">
        <div className="container">
          <h2>Our Active Volunteers</h2>
          <p className="muted">Meet the dedicated individuals making a difference in our community</p>
          
          {loading ? (
            <div className="volunteers-loading">
              <p>Loading volunteers...</p>
            </div>
          ) : allVolunteers.length === 0 ? (
            <div className="no-volunteers">
              <p>No active volunteers at the moment.</p>
              <Link to="/volunteer/register" className="btn primary">Become Our First Volunteer</Link>
            </div>
          ) : (
            <div className="volunteers-grid">
              {allVolunteers.map((volunteer, index) => { // Changed from topVolunteers to allVolunteers
                const imageUrl = getImageUrl(volunteer.profileImage || volunteer.profilePicture);
                const volunteerId = volunteer.id || index;
                
                return (
                  <div key={volunteerId} className="volunteer-card">
                    <div className="volunteer-image">
                      {imageUrl ? (
                        <>
                          {imageLoading[volunteerId] && (
                            <div className="volunteer-image-loading">Loading...</div>
                          )}
                          <img
                            src={imageUrl}
                            alt={volunteer.name || "Volunteer"}
                            onLoad={() => handleImageLoad(volunteerId)}
                            onError={() => handleImageError(volunteerId)}
                            style={{ display: imageLoading[volunteerId] === false ? 'block' : 'none' }}
                          />
                        </>
                      ) : null}
                      <div 
                        className="volunteer-avatar"
                        style={{ display: imageUrl && imageLoading[volunteerId] !== false ? 'none' : 'flex' }}
                      >
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                    <div className="volunteer-details">
                      <h3>{volunteer.name || volunteer.fullName || "Volunteer"}</h3>
                      <p className="volunteer-role">{volunteer.role || "Community Volunteer"}</p>
                      <p className="volunteer-bio">{volunteer.bio || volunteer.description || "Dedicated to making a difference in the community."}</p>
                      
                      <div className="volunteer-contact">
                        {volunteer.email && (
                          <p><i className="fas fa-envelope"></i> {volunteer.email}</p>
                        )}
                        {volunteer.phone && (
                          <p><i className="fas fa-phone"></i> {volunteer.phone}</p>
                        )}
                        {volunteer.location && (
                          <p><i className="fas fa-map-marker-alt"></i> {volunteer.location}</p>
                        )}
                      </div>
                      
                      <div className="volunteer-skills">
                        {volunteer.skills && Array.isArray(volunteer.skills) ? (
                          volunteer.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="skill-tag">{skill}</span>
                          ))
                        ) : volunteer.skills ? (
                          <span className="skill-tag">{volunteer.skills}</span>
                        ) : (
                          <span className="skill-tag">Community Service</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="volunteers-cta">
            <Link to="/volunteers" className="btn outline">View All Volunteers</Link>
            <Link to="/volunteer/register" className="btn primary">Join Our Team</Link>
          </div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="home-events">
        <div className="container">
          <h2>Upcoming Events</h2>
          {loading ? (
            <p className="muted">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="muted">No events available currently.</p>
          ) : (
            <div className="events-grid">
              {events.map((ev) => (
                <div key={ev.id} className="event-card">
                  <h3>{ev.name}</h3>
                  <p><strong>Location:</strong> {ev.location}</p>
                  <p><strong>Date:</strong> {new Date(ev.date).toLocaleString()}</p>
                  <p>{ev.description}</p>
                </div>
              ))}
            </div>
          )}
          <Link to="/events" className="btn primary small">View All Events</Link>
        </div>
      </section>

      {/* TOP DONORS & VOLUNTEERS */}
      <section className="leaders">
        <div className="container flex-split">
          <div>
            <h3>Top Donors</h3>
            <ul className="list">
              {topDonors.length > 0 ? topDonors.map((d, i) => (
                <li key={d.id ?? i}>
                  <strong>{d.name ?? d.donorName}</strong> — ₹{d.amount ?? 0}
                  <span className="muted small">{d.date ? new Date(d.date).toLocaleDateString() : ""}</span>
                </li>
              )) : <li className="muted">No donors yet.</li>}
            </ul>
            <Link to="/donations" className="btn ghost small">View All Donations</Link>
          </div>

          <div>
            <h3>Recent Volunteers</h3>
            <ul className="list">
              {allVolunteers.length > 0 ? allVolunteers.slice(0, 5).map((v, i) => { // Slicing here to show only a few recent volunteers in this list
                const imageUrl = getImageUrl(v.profileImage || v.profilePicture);
                const volunteerId = v.id || i;
                
                return (
                  <li key={volunteerId} className="recent-volunteer">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={v.name} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const placeholder = e.target.nextSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="recent-volunteer-placeholder"
                      style={{ display: imageUrl ? 'none' : 'flex' }}
                    >
                      {v.name ? v.name.charAt(0).toUpperCase() : 'V'}
                    </div>
                    <div className="recent-volunteer-info">
                      <strong>{v.name ?? v.fullName}</strong>
                      <span className="muted small">{v.email ?? v.phone}</span>
                    </div>
                  </li>
                );
              }) : <li className="muted">No volunteers found.</li>}
            </ul>
            <Link to="/volunteer/register" className="btn primary small">Become a Volunteer</Link>
          </div>
        </div>
      </section>

      {/* MISSION / GOALS */}
      <section className="mission">
        <div className="container">
          <h2>Our Mission</h2>
          <p className="mission-intro">
            Committed to serving society by promoting education, moral values, and social welfare.
            We focus on healthcare, education, Islamic teachings, disaster relief and community development to create
            sustainable change in communities.
          </p>
          
          <div className="mission-tabs">
            {missionTabs.map((tab, index) => (
              <button
                key={index}
                className={`mission-tab ${activeMissionTab === index ? 'active' : ''}`}
                onClick={() => setActiveMissionTab(index)}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.title}
              </button>
            ))}
          </div>
          
          <div className="mission-content">
            <div className="mission-details">
              <h3>{missionTabs[activeMissionTab].title}</h3>
              <p>{missionTabs[activeMissionTab].description}</p>
              
              <h4>Key Initiatives:</h4>
              <ul>
                {missionTabs[activeMissionTab].initiatives.map((initiative, i) => (
                  <li key={i}>{initiative}</li>
                ))}
              </ul>
              
              <div className="mission-actions">
                <Link to="/volunteer/register" className="btn primary">
                  <i className="fas fa-hands-helping"></i> Get Involved
                </Link>
                <Link to="/donate" className="btn outline">
                  <i className="fas fa-donate"></i> Support This Cause
                </Link>
              </div>
            </div>
            
            <div className="mission-visual">
              <div className="mission-icon">
                <i className={`fas ${missionTabs[activeMissionTab].icon}`}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VOLUNTEER QUICK FORM */}
      <section className="volunteer-cta">
        <div className="container">
          <h2>Join Us Today</h2>
          <p className="muted">Your time and skills can change lives. Become a volunteer.</p>
          <div className="hero-ctas">
            <Link to="/volunteer/register" className="btn primary large">Register as Volunteer</Link>
            <Link to="/contact" className="btn outline large">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;