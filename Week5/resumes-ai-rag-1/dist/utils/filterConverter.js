"use strict";
/**
 * Filter Converter Utility
 * Converts user-friendly filter names to MongoDB field names
 * and applies proper MongoDB query operators
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFilters = convertFilters;
exports.getFilterDocumentation = getFilterDocumentation;
exports.validateFilters = validateFilters;
/**
 * Convert user-friendly filter options to MongoDB query format
 *
 * @param filters - User-friendly filter options
 * @returns MongoDB query object suitable for $match stage
 */
function convertFilters(filters) {
    if (!filters || Object.keys(filters).length === 0) {
        return {};
    }
    const mongoQuery = {};
    const typedFilters = filters;
    // Handle experience filters
    if (typedFilters.minYearsExperience !== undefined) {
        mongoQuery.totalExperience = mongoQuery.totalExperience || {};
        mongoQuery.totalExperience['$gte'] = typedFilters.minYearsExperience;
    }
    if (typedFilters.maxYearsExperience !== undefined) {
        mongoQuery.totalExperience = mongoQuery.totalExperience || {};
        mongoQuery.totalExperience['$lte'] = typedFilters.maxYearsExperience;
    }
    // Handle relevant experience filters
    if (typedFilters.minRelevantExperience !== undefined) {
        mongoQuery.relevantExperience = mongoQuery.relevantExperience || {};
        mongoQuery.relevantExperience['$gte'] = typedFilters.minRelevantExperience;
    }
    if (typedFilters.maxRelevantExperience !== undefined) {
        mongoQuery.relevantExperience = mongoQuery.relevantExperience || {};
        mongoQuery.relevantExperience['$lte'] = typedFilters.maxRelevantExperience;
    }
    // Handle location filter (case-insensitive partial match)
    if (typedFilters.location !== undefined) {
        mongoQuery.location = {
            $regex: typedFilters.location,
            $options: 'i' // Case-insensitive
        };
    }
    // Handle role filter (case-insensitive partial match)
    if (typedFilters.role !== undefined) {
        mongoQuery.role = {
            $regex: typedFilters.role,
            $options: 'i'
        };
    }
    // Handle skills filter
    if (typedFilters.skills !== undefined) {
        const skillsArray = Array.isArray(typedFilters.skills)
            ? typedFilters.skills
            : [typedFilters.skills];
        mongoQuery.skills = {
            $in: skillsArray.map(s => typeof s === 'string'
                ? { $regex: s, $options: 'i' }
                : s)
        };
    }
    // Handle company filter (case-insensitive partial match)
    if (typedFilters.company !== undefined) {
        mongoQuery.company = {
            $regex: typedFilters.company,
            $options: 'i'
        };
    }
    // Handle education filter
    if (typedFilters.education !== undefined) {
        mongoQuery.education = {
            $regex: typedFilters.education,
            $options: 'i'
        };
    }
    // Pass through any direct MongoDB query filters (for advanced users)
    // These are fields that don't match any of the above
    const standardFields = [
        'minYearsExperience',
        'maxYearsExperience',
        'minRelevantExperience',
        'maxRelevantExperience',
        'location',
        'role',
        'skills',
        'company',
        'education'
    ];
    for (const key in typedFilters) {
        if (!standardFields.includes(key) && typedFilters[key] !== undefined) {
            // Direct pass-through for MongoDB field names
            mongoQuery[key] = typedFilters[key];
        }
    }
    return mongoQuery;
}
/**
 * Get filter usage documentation
 */
function getFilterDocumentation() {
    return `
Filter Options Documentation:

EXPERIENCE FILTERS:
- minYearsExperience: number
  Total years of experience >= this value
  Example: { "minYearsExperience": 5 }

- maxYearsExperience: number
  Total years of experience <= this value
  Example: { "maxYearsExperience": 10 }

- minRelevantExperience: number
  Relevant years of experience >= this value
  Example: { "minRelevantExperience": 3 }

- maxRelevantExperience: number
  Relevant years of experience <= this value
  Example: { "maxRelevantExperience": 7 }

LOCATION FILTER:
- location: string
  Case-insensitive partial match
  Example: { "location": "California" }

ROLE FILTER:
- role: string
  Case-insensitive partial match
  Example: { "role": "Engineer" }

SKILLS FILTER:
- skills: string | string[]
  Matches candidates with specified skills (case-insensitive)
  Example: { "skills": ["Python", "Java"] }

COMPANY FILTER:
- company: string
  Case-insensitive partial match
  Example: { "company": "Google" }

EDUCATION FILTER:
- education: string
  Case-insensitive partial match
  Example: { "education": "Computer Science" }

COMBINED FILTERS EXAMPLE:
{
  "minYearsExperience": 5,
  "location": "USA",
  "skills": ["Python", "Kubernetes"],
  "role": "Backend"
}

DIRECT MONGODB QUERIES:
For advanced users, pass MongoDB query operators directly:
{
  "total_Experience": { "$gte": 5, "$lte": 10 },
  "location": { "$regex": "San", "$options": "i" }
}
`;
}
/**
 * Validate filters
 */
function validateFilters(filters) {
    const errors = [];
    if (!filters) {
        return { valid: true, errors: [] };
    }
    const typedFilters = filters;
    // Validate number fields
    const numberFields = [
        'minYearsExperience',
        'maxYearsExperience',
        'minRelevantExperience',
        'maxRelevantExperience'
    ];
    for (const field of numberFields) {
        if (typedFilters[field] !== undefined) {
            if (typeof typedFilters[field] !== 'number' || typedFilters[field] < 0) {
                errors.push(`${field} must be a non-negative number`);
            }
        }
    }
    // Validate min/max pairs
    if (typedFilters.minYearsExperience !== undefined &&
        typedFilters.maxYearsExperience !== undefined) {
        if (typedFilters.minYearsExperience > typedFilters.maxYearsExperience) {
            errors.push('minYearsExperience must be <= maxYearsExperience');
        }
    }
    if (typedFilters.minRelevantExperience !== undefined &&
        typedFilters.maxRelevantExperience !== undefined) {
        if (typedFilters.minRelevantExperience > typedFilters.maxRelevantExperience) {
            errors.push('minRelevantExperience must be <= maxRelevantExperience');
        }
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
