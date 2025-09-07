import React from 'react';

interface PropertyReportData {
  id: string;
  title: string;
  price: number;
  sqft: number;
  yearBuilt: number;
  beds: number;
  baths: number;
  lat: number;
  lng: number;
  type: string;
  locationScore: number;
  safetyScore: number;
  schoolScore: number;
  commuteMinutes: number;
  idealityScore: number;
  createdAt: string;
  scoreBreakdown: {
    price: number;
    features: number;
    location: number;
    safety: number;
    schools: number;
    commute: number;
  };
  neighborhoodData: {
    averagePrice: number;
    averageSqft: number;
    totalProperties: number;
    propertyTypes: { [key: string]: number };
  };
}

interface PropertyReportTemplateProps {
  property: PropertyReportData;
  chartImage?: string;
}

export default function PropertyReportTemplate({ property, chartImage }: PropertyReportTemplateProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#1f2937',
      lineHeight: '1.6',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#ffffff'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        borderBottom: '3px solid #3b82f6',
        paddingBottom: '20px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0 0 10px 0'
        }}>
          Property Report
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: '0'
        }}>
          Generated on {formatDate(new Date().toISOString())}
        </p>
      </div>

      {/* Property Overview */}
      <div style={{ 
        backgroundColor: '#f8fafc',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0 0 20px 0'
        }}>
          {property.title}
        </h2>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#3b82f6',
              marginBottom: '5px'
            }}>
              {formatPrice(property.price)}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#6b7280'
            }}>
              {property.type} • Built in {property.yearBuilt}
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            padding: '15px 20px',
            backgroundColor: getScoreColor(property.idealityScore),
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold'
            }}>
              {property.idealityScore}/100
            </div>
            <div style={{ 
              fontSize: '12px',
              opacity: '0.9'
            }}>
              {getScoreLabel(property.idealityScore)}
            </div>
          </div>
        </div>

        {/* Property Features */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1f2937'
            }}>
              {property.beds}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Bedrooms
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1f2937'
            }}>
              {property.baths}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Bathrooms
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1f2937'
            }}>
              {property.sqft.toLocaleString()}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Square Feet
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1f2937'
            }}>
              {property.commuteMinutes}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Min Commute
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div style={{ 
        marginBottom: '30px'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0 0 20px 0'
        }}>
          Ideality Score Breakdown
        </h3>
        
        {chartImage && (
          <div style={{ 
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <img 
              src={chartImage} 
              alt="Score Breakdown Chart"
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
          </div>
        )}

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px'
        }}>
          {Object.entries(property.scoreBreakdown).map(([key, score]) => (
            <div key={key} style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                textTransform: 'capitalize'
              }}>
                {key}
              </span>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ 
                  width: '60px',
                  height: '6px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${score}%`,
                    height: '100%',
                    backgroundColor: getScoreColor(score),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  minWidth: '30px',
                  textAlign: 'right'
                }}>
                  {score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Neighborhood Data */}
      <div style={{ 
        backgroundColor: '#f8fafc',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0 0 20px 0'
        }}>
          Neighborhood Overview
        </h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#1f2937'
            }}>
              {formatPrice(property.neighborhoodData.averagePrice)}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Average Price
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#1f2937'
            }}>
              {property.neighborhoodData.averageSqft.toLocaleString()}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Average Sqft
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#1f2937'
            }}>
              {property.neighborhoodData.totalProperties}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Properties
            </div>
          </div>
        </div>

        {/* Property Types Distribution */}
        <div>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151',
            margin: '0 0 15px 0'
          }}>
            Property Types in Area
          </h4>
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {Object.entries(property.neighborhoodData.propertyTypes).map(([type, count]) => (
              <div key={type} style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #d1d5db',
                fontSize: '12px'
              }}>
                <span style={{ 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {type}
                </span>
                <span style={{ 
                  color: '#6b7280',
                  fontSize: '11px'
                }}>
                  ({count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb',
        color: '#6b7280',
        fontSize: '12px'
      }}>
        <p style={{ margin: '0' }}>
          This report was generated automatically by PropertyFinder Pro
        </p>
        <p style={{ margin: '5px 0 0 0' }}>
          Property ID: {property.id} • Generated: {formatDate(property.createdAt)}
        </p>
      </div>
    </div>
  );
}
