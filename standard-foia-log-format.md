# Standard FOIA Log Format (SFLF) Specification

## Version: 1.5.0

## Introduction

The Standard FOIA Log Format (SFLF) aims to standardize the disparate FOIA logs released by various government agencies. This document outlines the specifications for the SFLF, which is designed to facilitate easier access, comparison and analysis of FOIA logs. The format is designed to cover both federal FOIA requests as well as records requests from US state agencies. Some fields may only be applicable in limited cases, while in many situations agencies do not track or release much detailed information on their requests, so that only a limited number of fields were present.

## File Format

The SFLF should be a CSV (Comma Separated Values) file with UTF-8 encoding. Miscellaneous headers that are not covered by the SFLF official headings list should be discarded so that the dataset starts with the proper column names.


## Columns

The SFLF will consist of the following standardized columns:

### 1. request id

- **Definition**: A unique identifier or tracking number for each FOIA request, typically assigned by the agency.
- **Type**: String
- **Constraints**: Must be unique within the file.
- **Example**: "REQ1234"

### 2. requester

- **Definition**: The name of the individual or entity requesting the information.
- **Type**: String
- **Example**: "Jane Doe"

### 3. requester organization

- **Definition**: The organization the requester is affiliated with, if applicable.
- **Type**: String
- **Example**: "MuckRock"

### 4. subject

- **Definition**: A brief description of the request's subject matter.
- **Type**: String
- **Example**: "Police misconduct records"

### 5. date requested

- **Definition**: The date the request was submitted by the requester.
- **Type**: Date (YYYY-MM-DD)
- **Example**: "2023-09-20"

### 6. date perfected
- **Definition**: The date when the agency determined the request was complete and could be processed.
- **Type**: Type: Date (YYYY-MM-DD)
- **Example**: "2023-09-25"

### 7. date completed

- **Definition**: The date the request was resolved, if applicable.
- **Type**: Date (YYYY-MM-DD)
- **Constraints**: Interpreter uses the [Parser library](https://dateutil.readthedocs.io/en/stable/parser.html) and accepts a wide range of date formats.
- **Example**: "2023-10-15"

### 8. status

- **Definition**: The current status of the request, as roughly mapped to MuckRock's potential statuses. These statuses might have less-than-obvious meanings due to their historical nature, such as 'processed' referring to any request that is being currently worked on by an agency, while 'abandoned' can refer to a request that has been withdrawn.
- **Type**: Enumerated String
- **Allowed Values**: "processed", "appealing", "fix", "payment", "lawsuit", "rejected", "no_docs", "done", "partial", "abandoned", or empty
- **Example**: "processed"

### 9. exemptions cited

- **Definition**: The specific FOIA or public records exemptions cited by the agency, if any.
- **Type**:  String
- **Example**: "b(3), b(6)"

### 10. fee category

- **Definition**: The fee category assigned to the requester.
- **Type**:  Enumerated String
- **Allowed Values**: "commercial", "educational", "news media", "other", or empty
- **Example**: "news media"

### 11. fee waiver

- **Definition**: Whether a fee waiver was requested and granted.
- **Type**:  Enumerated String
- **Allowed Values**:	"not requested" (no fee waiver requested), "requested, denied" (fee waiver was requested but denied), "requested, granted" (fee waiver was requested and approved), or empty
- **Example**: "not requested"

### 12. fees charged

- **Definition**: The amount charged to the requester for the processing of the request that was ultimately paid, if any.
- **Type**:  Numeric (Decimal)
- **Example**:  "25.00"

### 13. processed under privacy act
- **Definition**: Whether the request was processed under the Privacy Act in addition to the Freedom of Information Act.
- **Type**:  Boolean ("yes" / "no")
- **Example**:  "no"

## Status Normalization

For FOIA logs that have a "status" column, it must be standardized according to the allowed values. If a different term is used in the original log, it should be mapped to one of the allowed values based on accompanying synonym text files.

## Column Mapping

When converting logs with different column names, use accompanying text files with column synonyms to map them to the standard SFLF columns.

## Synonym Files

To aid in the conversion of non-standard FOIA logs, two text files are used:

1. **Status Synonyms File**: `status_synonyms.txt`
    - This file contains mappings of various status terms to the allowed values in the SFLF.
  
2. **Column Synonyms File**: `synonyms.txt`
    - This file contains mappings of various column names to the standard SFLF columns.

## Uploader

MuckRock staff members can access the FOIA Log Uploader tool. In addition to the data in the CSV, the following fields are requested during the upload process:

### 1. source

- **Definition**: Where the FOIA log was obtained. If possible, should be the original URL source. If not, should be descriptive such as "Provided via email to info@muckrock.com by J. Smith."
- **Type**: String
- **Example**: "https://vault.fbi.gov/foia-logs-2000-through-2016/foia-log-2004/view"

### 2. agency

- **Definition**: The associated federal, state or local agency with the particular log. This is chosen via a select box.
- **Type**: String
- **Example**: "FBI, Federal"

### 2. time period of log

- **Definition**: The start and end date of the period of the given FOIA or public records log.


    
## For Developers

To implement this specification, follow these guidelines:

1. **Read the accompanying text files (status_synonyms.txt for status and synonyms.txt for columns) to dynamically map non-standard terms.**
2. **Validate the log for column and status consistency post-conversion.**
3. **Log any inconsistencies or issues for manual review.**

## Examples

_Real-world examples of FOIA logs, both before and after being converted to SFLF, should be added here._

## FAQs

Frequently asked questions (FAQs) to address common issues and solutions will be added here.

## Change Log

- Version 1.5.0: Incorporated a number of additional fields identified by the Federal FOIA Advisory Committee as pertinent to research and accountability. See https://www.archives.gov/files/proactive-disclosure-subcommittee-foia-log-recommendation-passed.pdf
- Version 1.3.0: Included names of relevant synonym files and made additional refinements.
- Version 1.2.0: Updated 'status' allowed values to include empty, refined 'source' definition, and added date parsing constraints.
- Version 1.1.0: Added guidelines for handling miscellaneous headers, corrected 'requestor' to 'requester', and added this change log.
- Version 1.0.0: Initial draft.

## Conclusion

Adhering to the SFLF will enable easier aggregation and analysis of FOIA logs across multiple agencies. It's a step toward making government transparency more robust and accessible.
